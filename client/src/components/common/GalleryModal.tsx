import Modal from "./Modal";
import ImageGallery from "react-image-gallery";
import React from "react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { url: string }[];
  title: string;
}

const GalleryModal = ({ isOpen, onClose, images, title }: GalleryModalProps) => {
  const imagesList = images.map((image) => ({
    original: image.url,
    thumbnail: image.url,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ImageGallery items={imagesList} />
    </Modal>
  );
};

export default GalleryModal;
