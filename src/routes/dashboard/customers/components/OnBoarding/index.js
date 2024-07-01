import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import styled from "styled-components";
import useDimensions from "react-use-dimensions";

import { Title, Paragraph } from "../Text";
import Space from "../Space";
import Button from "../Button";

import circlesSrc from "./assets/circles.svg";

import collectYourWasteSrc from "./assets/collect-your-waste.png";
import requestAPickupSrc from "./assets/request-a-pickup.png";
import dropYourBagsSrc from "./assets/drop-your-bags.png";
import handoverBagsSrc from "./assets/handover-bags.png";
import getYourPointsSrc from "./assets/get-your-points.png";

const BOARDS = {
  COLLECT_YOUR_WASTE: {
    title: "Collect Your Recyclables",
    // eslint-disable-next-line max-len
    text: "You can place your separated recyclables in your bags and from there on, we will sort them for you.",
    image: collectYourWasteSrc,
    circle: {
      x: (i) => window.innerWidth * i + -50,
      y: () => 0,
      rotation: (i) => i * 60,
    },
  },
  REQUEST_A_PICKUP: {
    title: "Request a Pickup",
    text: "Put a sticker on your bag(s) and scan them to create a request.",
    image: requestAPickupSrc,
    circle: {
      x: (i) => window.innerWidth * i + 120,
      y: () => 40,
      rotation: (i) => i * 60,
    },
  },
  DROP_YOUR_BAGS: {
    title: "Drop Your Bags!",
    // eslint-disable-next-line max-len
    text: "Place your bags with stickers on them in one of our designated cages to create a request.",
    image: dropYourBagsSrc,
    circle: {
      x: (i) => window.innerWidth * i + 120,
      y: () => 40,
      rotation: (i) => i * 60,
    },
  },
  HANDOVER_BAGS: {
    title: "Handover Bags",
    text: "Simply put your bags outside your apartment so we can pick them up.",
    image: handoverBagsSrc,
    circle: {
      x: (i) => window.innerWidth * i + -40,
      y: () => 140,
      rotation: (i) => i * 60,
    },
  },
  GET_YOUR_POINTS: {
    title: "Get Your Points",
    text: "After processing the bags you will be rewarded points for each bag!",
    image: getYourPointsSrc,
    circle: {
      x: (i) => window.innerWidth * i + 20,
      y: () => 20,
      rotation: (i) => i * 60,
    },
  },
};

const TIERS = {
  REGULAR: [
    BOARDS.COLLECT_YOUR_WASTE,
    BOARDS.DROP_YOUR_BAGS,
    BOARDS.GET_YOUR_POINTS,
  ],
  PRO: [
    BOARDS.COLLECT_YOUR_WASTE,
    BOARDS.DROP_YOUR_BAGS,
    BOARDS.GET_YOUR_POINTS,
  ],
  PREMIUM: [
    BOARDS.COLLECT_YOUR_WASTE,
    BOARDS.REQUEST_A_PICKUP,
    BOARDS.HANDOVER_BAGS,
    BOARDS.GET_YOUR_POINTS,
  ],
};

const Scene = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;

  pointer-events: ${({ visible }) => (visible ? "all" : "none")};
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.brandLight},
    ${({ theme }) => theme.colors.brandDark}
  );

  transition: opacity 500ms;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

const Card = styled(motion.div)`
  position: fixed;
  top: 45px;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  padding: 25px 0;
  width: 100%;
  overflow: hidden;

  background: ${({ theme }) => theme.colors.light};
  box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.3);
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;

  z-index: 2; // TODO override top white gradient
`;

const Wrapper = styled(motion.div)`
  display: flex;
  flex-wrap: nowrap;
`;

const Board = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  width: 100vw;
`;

const BoardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 15px;
  text-align: center;
`;

const ImageWrapper = styled.div``;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  max-height: ${({ customHeight }) => customHeight}px;
`;

const CirclesWrapper = styled(motion.div)`
  position: absolute;
  width: 64vw;
  left: 4%;
  top: 6%;
`;

const Circles = styled.img.attrs({
  src: circlesSrc,
})`
  width: 100%;
  pointer-events: none;

  animation: circles 40000ms linear infinite;

  @keyframes circles {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Fixed = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  z-index: 999999;
`;

const Dot = styled.div`
  width: ${({ active }) => (active ? 36 : 12)}px;
  height: 6px;
  background: ${({ active }) => (active ? "#27252F" : "#C4C4C4")};
  border-radius: 20px;
  &:not(:last-child) {
    margin-right: 5px;
  }

  transition:
    background 500ms,
    width 500ms;
`;

const ButtonNext = styled(Button)`
  max-width: 290px;
  z-index: 999999;
  white-space: pre;
  flex-shrink: 0;
`;

const CARD_VARIANTS = {
  visible: { y: 0 },
  hidden: { y: "120%" },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const OnBoarding = ({ isOpen, onClose, tier = "REGULAR" }) => {
  const boards = TIERS[tier];
  const [activeItem, setActiveItem] = useState(0);

  const [position, setPosition] = useState(0);
  const motionX = useMotionValue(0);

  const [wrapperRef] = useDimensions();
  const [boardContentRef, boardContentSize] = useDimensions();
  const [actionsRef, actionsSize] = useDimensions();

  const circleX = useTransform(
    motionX,
    // [0, window.innerWidth * -1, window.innerWidth * -2, window.innerWidth * -3],
    boards.map((_, i) => window.innerWidth * i * -1),
    // [
    //   -50,
    //   window.innerWidth + 120,
    //   (window.innerWidth * 2) - 40,
    //   (window.innerWidth * 3),
    // ]
    boards.map(({ circle: { x } }, i) => x(i)),
  );
  const circleY = useTransform(
    motionX,
    // [0, window.innerWidth * -1, window.innerWidth * -2, window.innerWidth * -3],
    boards.map((_, i) => window.innerWidth * i * -1),
    // [0, 40, 140, 20],
    boards.map(({ circle: { y } }, i) => y(i)),
  );
  const circleRotate = useTransform(
    motionX,
    // [0, window.innerWidth * -1, window.innerWidth * -2, window.innerWidth * -3],
    boards.map((_, i) => window.innerWidth * i * -1),
    // [0, 60, 120, 180],
    boards.map(({ circle: { rotation } }, i) => rotation(i)),
  );

  useEffect(() => {
    motionX.set(position);
  }, [position, motionX]);

  const paginate = (direction) => {
    if (direction === 1) {
      setPosition(
        Math.max(
          -(boards.length - 1) * window.innerWidth,
          position - window.innerWidth,
        ),
      );
      setActiveItem(Math.min(boards.length - 1, activeItem + 1));
    } else {
      setPosition(Math.min(0, position + window.innerWidth));
      setActiveItem(Math.max(0, activeItem - 1));
    }
  };

  const handleOnClickNext = () => paginate(1);

  const customImageHeight =
    window.innerHeight -
    (boardContentSize.height + 50 + (actionsSize.height + 30 + 40));

  const isLastBoard = activeItem === boards.length - 1;

  return (
    <Scene visible={isOpen}>
      <Overlay visible={isOpen} />
      <Card
        variants={CARD_VARIANTS}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        <Wrapper
          ref={wrapperRef}
          style={{ x: motionX }}
          animate={{ x: position }}
          transition={{
            x: { type: "spring", stiffness: "100", damping: 15, mass: 1.1 },
          }}
          drag="x"
          dragConstraints={{
            left: position,
            right: 0,
          }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <CirclesWrapper
            style={{
              x: circleX,
              y: circleY,
              rotate: circleRotate,
            }}
          >
            <Circles />
          </CirclesWrapper>
          {boards.map((board, index) => (
            <Board key={board.title} active={activeItem === index}>
              <ImageWrapper>
                <Image
                  src={board.image}
                  alt={board.title}
                  customHeight={customImageHeight}
                />
              </ImageWrapper>
              <BoardContent ref={boardContentRef}>
                <Title fontSize={30}>{board.title}</Title>
                <Space h={5} />
                <Paragraph fontSize={16} opacity={0.4}>
                  {board.text}
                </Paragraph>
              </BoardContent>
            </Board>
          ))}
        </Wrapper>
        <Fixed ref={actionsRef}>
          <Dots>
            {boards.map((board, index) => (
              <Dot key={board.title} active={index === activeItem} />
            ))}
          </Dots>
          <ButtonNext onClick={isLastBoard ? onClose : handleOnClickNext}>
            {isLastBoard ? (
              <>
                Let&apos;s start the&nbsp;
                <strong>Ree</strong>
                volution.
              </>
            ) : (
              "Next"
            )}
          </ButtonNext>
        </Fixed>
      </Card>
    </Scene>
  );
};

export default OnBoarding;
