import Modal from "./Modal";
import ImageGallery from "react-image-gallery";

const GalleryModal = ({ isOpen, onClose, images, title }) => {
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
