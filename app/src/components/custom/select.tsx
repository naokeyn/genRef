"use client"

import { createListCollection } from "@chakra-ui/react"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText

} from "../ui/select"

interface SelectorProps {
  label: string,
  collections: Array<{ label: string, value: string }>,
  colorPalette?: string,
}

function Selector({ label, collections, colorPalette = "teal" }: SelectorProps) {
  const listCollection = createListCollection({ "items": collections })

  return (
    <SelectRoot
      collection={listCollection}
      size="sm"
      colorPalette={colorPalette}
    >
      <SelectLabel>{label}</SelectLabel>
      <SelectTrigger onChange={() => alert("changed")}>
        <SelectValueText placeholder={"Select " + label} />
      </SelectTrigger>
      <SelectContent>
        {listCollection.items.map((movie) => (
          <SelectItem item={movie} key={movie.value}>
            {movie.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

export default Selector
