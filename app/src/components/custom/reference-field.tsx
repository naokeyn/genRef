
import { Stack, HStack, Text, Spacer, Textarea } from "@chakra-ui/react"
import CopyButton from "../custom/copy-button"

interface ReferenceFieldProps {
  reference: string,
  height?: string,
  colorPalette?: string,
}

function ReferenceField({ reference, height = "100px", colorPalette = "teal" }: ReferenceFieldProps) {

  return (
    <Stack>
      <HStack>
        <Text fontSize="large" as={"h2"}>Reference</Text>
        <Spacer />
        <CopyButton text={reference} size="sm" />
      </HStack>
      <Textarea
        h={height}
        defaultValue={reference}
        colorPalette={colorPalette}
      />
    </Stack>
  )
}

export default ReferenceField
