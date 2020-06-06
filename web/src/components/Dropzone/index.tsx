import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone = ({ onFileUploaded }: Props): JSX.Element => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileUrl = URL.createObjectURL(file);
      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ['image/png', 'image/jpeg'],
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/png,image/jpeg" />
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Current Selected" />
      ) : (
        <p>
          <FiUpload />
          Arraste e solte aqui a imagem do seu estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
