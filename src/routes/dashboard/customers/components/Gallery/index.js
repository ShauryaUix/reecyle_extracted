import React from "react";
import styled from "styled-components";

const GalleryWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  gap: 15px;
  margin: 0 -25px;
  padding: 10px 0px 10px 25px;
  width: calc(100% + 50px);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const GalleryImage = styled.img`
  width: auto;
  height: 20vh;
  border-radius: 10px;
`;

export default function Gallery({ images = [] }) {
  return (
    <GalleryWrapper fontSize={14} opacity={0.8}>
      {images.map((image) => (
        <GalleryImage key={image.src} src={image.src} />
      ))}
      <div style={{ width: 10, flex: "1 0 auto" }} />
    </GalleryWrapper>
  );
}
