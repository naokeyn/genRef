import { Group, InputAddon, Input } from "@chakra-ui/react";
import CopyButton from "./copy-button";

interface CopyGroupProps {
  label: string,
  value: string,
  colorPalette?: string,
}

const CopyGroup = ({ label, value, colorPalette = "teal" }: CopyGroupProps) => {
  return (
    <Group attached>
      <InputAddon>{label}</InputAddon>
      <Input p="2" placeholder={label} defaultValue={value} />
      <CopyButton text={value} colorPalette={colorPalette} />
    </Group>
  )
}

export default CopyGroup
