import { useRef, useEffect } from 'react';
import { Text, Group, Box, SimpleGrid, Image, ActionIcon } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from '@mantine/dropzone';

export default function FileUpload({ files, setFiles, isFileSizeError, setIsFileSizeError }) {
  const openRef = useRef(null);

  useEffect(() => {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 20000000) {
      setIsFileSizeError(true)
    } else {
      setIsFileSizeError(false)
    }
  }, [files, setIsFileSizeError]);

  const dropFiles = (newFiles) => {
    setFiles([...files, ...newFiles]);
  };

  const handleDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return <Box pos="relative" key={`file-${index}`}>
      <ActionIcon
        size="xs"
        variant="filled"
        aria-label="Bild löschen"
        pos="absolute"
        onClick={() => handleDelete(index)}
        right={0}
        color="red"
      >
        <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
      <Image 
        radius="md"
        src={file.type === 'application/pdf' ? '/imgs/pdf.png' : imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    </Box>
  });

  return (
    <>
      <Text size="sm" fw={500} mb="4px">Bilder / PDF hochladen (optional)</Text>
      <Dropzone
        onDrop={dropFiles}
        maxSize={20 * 1024 ** 2}
        accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
        activateOnClick={false}
        openRef={openRef}
      >
        <Group justify="center" gap="sm" style={{ pointerEvents: 'all', cursor: 'pointer' }} onClick={() => openRef.current?.()}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="sm" c="dimmed" inline mt={7} ta="center">
              Ziehe Bilder hierher oder klicke, um Dateien auszuwählen (max 20 MB).
            </Text>
          </div>
        </Group>
      </Dropzone>

      {previews.length > 0 && <Box bd="calc(0.0625rem * var(--mantine-scale)) dashed var(--mantine-color-gray-4)" p="sm">
        <SimpleGrid cols={{ base: 2, sm: 3 }}>
          {previews}
        </SimpleGrid>
      </Box>}

      {isFileSizeError && <Text size="sm" c="red" mt="sm">Deine Dateien überschreiten die Maximale Größe von 20 MB.</Text>}
    </>
  );
}
