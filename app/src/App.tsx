import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Center,
  Group,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'

import ReferenceField from './components/custom/reference-field'
import CopyGroup from './components/custom/copy-group'
import Selector from './components/custom/selector'
import { postData } from './components/utils/api'

function App() {
  const [pageInfo, setPageInfo] = useState<{ title: string, url: string }>({ title: '', url: '' })
  const [date, setDate] = useState<string>('')
  const [reference, setReference] = useState<string>('')
  const [authors, setAuthors] = useState<string>('Unknown')
  const [format, setFormat] = useState<string>('jsme-jp')
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [customFormat, setCustomFormat] = useState<string>('"[title]", available from <[url]>, ([year]/[month]/[day]).')
  const [isGemini, setIsGemini] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 今日の日付を取得
  const month_en_list = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ]
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1) //.padStart(2, '0')
  const day = String(today.getDate()) //.padStart(2, '0')
  const month_en = month_en_list[Number(month) - 1]

  useEffect(() => {
    // 現在のタブからページのタイトルとURLを取得
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setPageInfo({
        title: tabs[0].title || 'hogehoge',
        url: tabs[0].url || 'hogehoge'
      })
      generateReference(format, {
        title: tabs[0].title || 'Error! Please reload the extention',
        url: tabs[0].url || ''
      })
      setDate(`${year}/${month}/${day}`)
    })
  }, [])

  const defaultFormats = {
    'jsme-jp': '[authors], "[title]" available from <[url]>, (参照日 [year]年[month]月[day]日).',
    'jsme-en': '[authors], "[title]" available from <[url]>, (accessed on [day] [month_en] [year]).',
    'ahfe': '[title], [url].',
  }

  const referenceFormat = (strFromat: string, pahgeInfo: { title: string, url: string }, author: string = authors) => {
    const format = strFromat
    const title = pahgeInfo.title
    const url = pahgeInfo.url

    let ref = format
    ref = ref.replace(/\[authors\]/g, author)
    ref = ref.replace(/\[title\]/g, title)
    ref = ref.replace(/\[url\]/g, url)
    ref = ref.replace(/\[year\]/g, String(year))
    ref = ref.replace(/\[month\]/g, month)
    ref = ref.replace(/\[day\]/g, day)
    ref = ref.replace(/\[month_en\]/g, month_en)

    return ref
  }

  const generateReference = (format: string, pageInfo: { title: string, url: string }, author: string = authors) => {
    setFormat(format)
    switch (format) {
      case 'jsme-jp':
        setReference(referenceFormat(defaultFormats['jsme-jp'], pageInfo, author))
        break
      case 'jsme-en':
        setReference(referenceFormat(defaultFormats['jsme-en'], pageInfo, author))
        break
      case 'ahfe':
        setReference(referenceFormat(defaultFormats['ahfe'], pageInfo, author))
        break
      default:
        setReference(referenceFormat(format, pageInfo, author))
        break
    }
  }

  const authorsEstimation = async (url: string) => {
    setIsLoading(true)
    const api_url: string = import.meta.env.VITE_API_URL || ""
    const data = await postData(api_url, url)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (data === null) {
      alert("Something went wrong. Please try again later.")
      setIsLoading(false)
      return
    }
    generateReference(format, pageInfo, data.authors)
    alert(`Author name has been changed to "${data.authors}". \nIf you dont like this, click "Submit" again`)
    setIsLoading(false)
    setAuthors(data.authors)
  }

  return (
    <>

      <Stack gap="4" w="400px" h="100%" m="1" p="4" >
        {/* header */}
        <HStack>
          <a href="https://github.com/naokeyn/genRef" target="_blank" rel="noreferrer">
            <img src="./logo_64x64.png" alt="site logo" />
          </a>
          <Spacer />
          <Text fontSize="xx-large" as={"h1"} fontFamily="Times New Roman">Reference Generator</Text>
        </HStack>

        <ReferenceField reference={reference} />

        <Selector
          label='形式を選択'
          collections={[
            { label: "日本機械学会形式 (JP)", value: "jsme-jp" },
            { label: "日本機械学会形式 (EN)", value: "jsme-en" },
            { label: "AHFE (Applied Human Factors and Ergonomics)", value: "ahfe" },
            { label: "カスタム", value: "custom" },
          ]}
          onSelectChange={(value) => { generateReference(value, pageInfo); setIsCustom(value === 'custom') }}
        />
        {isCustom &&
          <>
            <Group attached>
              <Input
                placeholder="カスタム形式"
                defaultValue="[title], [url], [year]/[month]/[day]."
                value={customFormat}
                onChange={(e) => { setCustomFormat(e.target.value) }}
              />
              <Button onClick={() => { generateReference(customFormat, pageInfo) }}>適用</Button>
            </Group>

            <details>
              <summary>カスタム形式のヒント</summary>
              <Text fontSize="small">以下のキーワードを使用してカスタム形式を作成できます。</Text>
              <Box as="ul" listStyleType="circle" pl="4" m="2">
                <li>[title]: ページのタイトル</li>
                <li>[url]: ページのURL</li>
                <li>[year]: 現在の年</li>
                <li>[month]: 現在の月</li>
                <li>[day]: 現在の日</li>
                <li>[month_en]: 現在の月の英語表記</li>
              </Box>
            </details>
          </>
        }

        <Selector
          label="著者/サイト名推定アルゴリズム"
          collections={[
            { label: "Unknown", value: "unknown" },
            { label: "Geminiで推定", value: "gemini" },
            // { label: "Whois検索", value: "whois" },
          ]}
          onSelectChange={(e) => setIsGemini(e.toString() === "gemini")}
        />

        {
          isGemini &&
          <>
            <Box>
              <Center w="100%">
                <form onSubmit={(e) => { 
                  e.preventDefault()
                  authorsEstimation(pageInfo.url)
                }}>
                  <Button type='submit' colorPalette={"teal"} disabled={isLoading}>
                    {!isLoading ? "Geminiで推定": "Geminiが考え中..."}
                  </Button>
                </form>
              </Center>
            </Box>
            <p>※テスト運用のため，間違った回答を生成する可能性があります．</p>
          </>
        }

        <hr />

        <Stack>
          <Text fontSize={"large"} as={"h1"}>
            個別にコピー
          </Text>
          <CopyGroup label="Title" value={pageInfo.title} colorPalette="purple" />
          <CopyGroup label="URL" value={pageInfo.url} colorPalette="purple" />
          <CopyGroup label="Date" value={date} colorPalette="purple" />
        </Stack>

      </Stack>
    </>
  )
}

export default App
