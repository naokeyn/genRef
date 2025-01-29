import { useState, useEffect } from 'react'
import {
  Box,
  Button,
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

function App() {
  const [pageInfo, setPageInfo] = useState<{ title: string, url: string }>({ title: '', url: '' })
  const [date, setDate] = useState<string>('')
  const [reference, setReference] = useState<string>('')
  const [format, setFormat] = useState<string>('jsme-jp')
  const [isCustom, setIsCustom] = useState<boolean>(false)
  const [customFormat, setCustomFormat] = useState<string>('"[title]", available from <[url]>, ([year]/[month]/[day]).')

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
    'jsme-jp': '著者名, "[title]" available from <[url]>, (参照日 [year]年[month]月[day]日).',
    'jsme-en': 'Authors, "[title]" available from <[url]>, (accessed on [day] [month_en] [year]).',
    'ahfe': '[title], [url].',
  }

  const referenceFormat = (strFromat: string, pahgeInfo: { title: string, url: string }) => {
    const format = strFromat
    const title = pahgeInfo.title
    const url = pahgeInfo.url

    let ref = format
    ref = ref.replace(/\[title\]/g, title)
    ref = ref.replace(/\[url\]/g, url)
    ref = ref.replace(/\[year\]/g, String(year))
    ref = ref.replace(/\[month\]/g, month)
    ref = ref.replace(/\[day\]/g, day)
    ref = ref.replace(/\[month_en\]/g, month_en)

    return ref
  }

  const generateReference = (format: string, pageInfo: { title: string, url: string }) => {
    setFormat(format)
    switch (format) {
      case 'jsme-jp':
        setReference(referenceFormat(defaultFormats['jsme-jp'], pageInfo))
        break
      case 'jsme-en':
        setReference(referenceFormat(defaultFormats['jsme-en'], pageInfo))
        break
      case 'ahfe':
        setReference(referenceFormat(defaultFormats['ahfe'], pageInfo))
        break
      default:
        setReference(referenceFormat(format, pageInfo))
        break
    }
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
            { label: "Whois検索", value: "whois" },
          ]}
        />

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
