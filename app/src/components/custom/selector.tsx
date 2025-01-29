import { Text } from "@chakra-ui/react";
import {
  NativeSelectField,
  NativeSelectRoot
} from "@chakra-ui/react";

interface SelectorProps {
  label: string,
  collections: Array<{ label: string, value: string }>,
  colorPalette?: string,
  onSelectChange?: (value: string) => void,
}

function Selector({ label, collections, colorPalette = "teal", onSelectChange }: SelectorProps) {
  return (
    <>
      <Text fontSize={"larger"} as={"h2"} mb={"-3"} color={colorPalette} fontWeight={"bold"}>{label}</Text>
      <NativeSelectRoot colorPalette={colorPalette}>
        <NativeSelectField onChange={(e) => onSelectChange && onSelectChange(e.target.value)}>
          {collections.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </>
  )
}

export default Selector
