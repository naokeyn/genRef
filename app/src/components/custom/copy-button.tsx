import { useState } from 'react';
import { Stack, Button } from '@chakra-ui/react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface CopyButtonProps {
  text: string;
  colorPalette?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function CopyButton({ text, colorPalette = "teal", size = "md" }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const copy2Clipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 3000);
  };

  return (
    <Stack>
      <Button
        colorPalette={colorPalette}
        variant={copied ? 'outline' : 'solid'}
        size={size}
        onClick={() => { copy2Clipboard(text) }}
      >
        {copied ? <FaCheck /> : <FaCopy />}
      </Button>
    </Stack>
  );
}

export default CopyButton;
