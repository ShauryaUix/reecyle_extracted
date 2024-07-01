import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import styled, {
  createGlobalStyle,
  useTheme,
  keyframes,
} from "styled-components";
import { transparentize } from "polished";
import { motion, AnimatePresence } from "framer-motion";

// import Admin from 'hive-admin';
import Query from "hive-admin/src/components/Query";
import InfiniteScrollQuery from "../../../components/InfiniteScrollQuery";

import Coupon, { getCouponColors } from "./components/Coupon";
import CouponCardModalContent from "./components/CouponCardModalContent";

import { ScannerContext } from "../../../components/CodeScanner";

import Layout from "./global/Layout";

import Header from "./components/Header";
import Space from "./components/Space";
import Category, { HorizontalScrollWrapper } from "./components/Category";
import ContentType from "./components/ContentTitle";
import Navigation from "./components/Navigation";
import ModalTitle from "./components/ModalTitle";
import { Paragraph, Title } from "./components/Text";
import Button, { ButtonCancel } from "./components/Button";
import Gallery from "./components/Gallery";

import OnBoarding from "./components/OnBoarding";

import ModalCard, {
  Spacer as ModalCardSpacerDefault,
} from "../../../common/components/ModalCard";

import Types from "../../../common/modules/types";

import avatarSrc from "./assets/icons/avatar.svg";
import reeWhiteSrc from "./assets/images/ree-white.png";

import categoryCardboardSrc from "./assets/categories/cardboard.png";
import categoryEwasteSrc from "./assets/categories/ewaste.png";
import categoryGlassSrc from "./assets/categories/glass.png";
import categoryMetalSrc from "./assets/categories/metal.png";
import categoryPaperSrc from "./assets/categories/paper.png";
import categoryPlasticSrc from "./assets/categories/plastic.png";
import categoryTextileSrc from "./assets/categories/textile.png";
import categoryWoodSrc from "./assets/categories/wood.png";

import scanSrc from "./assets/icons/scan.svg";

import { useCachedRequest } from "../../../helpers/useRequest";

const CATEGORY_IMAGE_MAP = {
  cardboard: categoryCardboardSrc,
  ewaste: categoryEwasteSrc,
  glass: categoryGlassSrc,
  metal: categoryMetalSrc,
  paper: categoryPaperSrc,
  plastic: categoryPlasticSrc,
  textile: categoryTextileSrc,
  wood: categoryWoodSrc,
};

const ITEMS = [
  {
    type: "link",
    name: "Reecycle",
    action: "reecycle",
  },
  {
    type: "button",
    action: "scan",
    icon: scanSrc,
  },
  {
    type: "link",
    name: "Reewards",
    action: "reewards",
  },
];

const GlobalStyle = createGlobalStyle`
    #admin #main #content {
      flex: 0 1 auto !important;
      padding: 0px;
      overflow: visible;
      margin-left: auto;
      margin-right: auto;
      width: 100%;
      margin: 0px;
      @media (min-width: 1025px) {
        margin: auto;
        margin-bottom: 20px;
        margin-top: 20px;
        overflow: hidden;
        max-width: 1024px;
      }
      /* @media (max-width: 600px) {
        margin-left: 20px;
        margin-right: 20px;
      } */
    }
  `;

const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.brandLight},
    ${({ theme }) => theme.colors.brandDark}
  );

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: background 500ms;
    background: ${({ theme, alt }) =>
      alt ? theme.colors.dark : "transparent"};
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  overflow: hidden;
  background: white;
  border-radius: 0 0 20px 20px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0%;
    left: 0;
    right: 0%;
    height: 30px;
    z-index: 1;
    border-radius: 0 0 20px 20px;
    background: linear-gradient(
      to top,
      hsla(0, 0%, 100%, 1),
      hsla(0, 0%, 100%, 0)
    );
  }
`;

const Scroll = styled(motion.div).attrs({
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 0, opacity: 0 },
})`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  padding: 20px 20px 30px;
  flex: 0 1 auto;
  height: 100vh;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ModalCardButtonWrapper = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.11);
  color: ${({ theme }) => theme.colors.text.light};
  background: ${({ theme }) => theme.colors.dark};
  text-align: center;
  /* padding: 12px; */
  flex-shrink: 0;
  font-weight: 600;
  white-space: nowrap;
  height: 60px;
  border-radius: 30px;
  &[data-journy-button="true"] {
    border-radius: 20px;
    margin-top: 10px;
    margin-bottom: 30px;
    background: linear-gradient(
      45deg,
      ${({ theme }) => theme.colors.brandLight},
      ${({ theme }) => theme.colors.brandDark}
    );
  }
`;

const ModalCardButtonTitle = styled.div`
  &:last-child {
    margin-top: 4px;
  }
`;

const ModalCardButtonSubtitle = styled.div`
  font-size: 12px;
  opacity: 0.7;
  &:last-child {
    margin-top: 4px;
  }
`;

const heroButtonGratientAnimations = [0, 1].map(
  (i) => keyframes`
    ${`${i}%`} {
      transform: translateX(-50vw) translateX(-100px) rotate(10deg);
    }
    100% {
      transform: translateX(50vw) translateX(100px) rotate(10deg);
    }
  `,
);

const HeroButtonGradient = styled.div`
  position: absolute;
  width: 200px;
  margin-left: -100px;
  top: -100px;
  bottom: -100px;
  left: 50%;
  opacity: 0.4;
  transform: translateX(-50vw) translateX(-100px) rotate(10deg);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  [data-animation="0"] & {
    animation: ${heroButtonGratientAnimations[0]} 350ms ease-out 1 forwards;
  }
  [data-animation="1"] & {
    animation: ${heroButtonGratientAnimations[1]} 350ms ease-out 1 forwards;
  }
`;

const heroButtonAnimations = [0, 1].map(
  (i) => keyframes`
    ${`${i}%`} { transform: scale(1); }
    50% { transform: scale(0.94); }
    100% { transform: scale(1); }
  `,
);

const HeroButtonWrapper = styled(ModalCardButtonWrapper)`
  &[data-animation="0"] {
    animation: ${heroButtonAnimations[0]} 0.18s ease-out 2 forwards;
  }
  &[data-animation="1"] {
    animation: ${heroButtonAnimations[1]} 0.18s ease-out 2 forwards;
  }
`;

const HeroButton = ({ title, subtitle, onClick }) => {
  const [animationState, setAnimationState] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(
      () => setAnimationState((animationState + 1) % 2),
      3000,
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [animationState]);
  return (
    <HeroButtonWrapper
      data-journy-button="true"
      data-animation={animationState}
      onClick={onClick}
    >
      <HeroButtonGradient />
      <ModalCardButtonSubtitle>{subtitle}</ModalCardButtonSubtitle>
      <ModalCardButtonTitle>
        {/* <strong style={{ fontWeight: 800 }}>Ree</strong>
          cycling Journey */}
        {title}
      </ModalCardButtonTitle>
    </HeroButtonWrapper>
  );
};

const CouponsPurchasedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-shrink: 0;
`;

const CouponsAvailableWrapper = styled.div`
  > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
  }
`;

const ModalCardSpacerWrapper = styled(ModalCardSpacerDefault)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vmin;
  flex: 1 0 auto;
`;

const ModalCardSpacerImage = styled(motion.div)`
  display: flex;
  flex: 1;
  width: 100%;
  height: 80vmin;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transform: scale(0.9);
`;

const ModalCardSpacerTitle = styled.div`
  font-size: 42px;
  font-weight: 800;
`;

const ListItem = styled.li`
  list-style: disc;
`;

const List = styled.ul`
  ${ListItem} {
    margin-left: 20px;
  }
`;

const TipWrapper = styled.div`
  padding: 20px 15px;
  width: calc(100% + 30px);
  margin: auto -15px;
  border-radius: 16px;
  background: ${({ theme }) => transparentize(0.8, theme.colors.brand)};
`;

const CouponsModalSpacer = ({ image, title, ...props }) => (
  <ModalCardSpacerWrapper {...props}>
    {image ? (
      <ModalCardSpacerImage style={{ backgroundImage: `url("${image}")` }} />
    ) : title ? (
      <ModalCardSpacerTitle>{title}</ModalCardSpacerTitle>
    ) : null}
  </ModalCardSpacerWrapper>
);

const ModalButtonsHorizontalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Customer(adminProps) {
  const { viewer, client, couponModalDomRef, ...props } = adminProps;
  const theme = useTheme();
  const scrollRef = useRef();
  const couponCodesQueryRef = useRef();
  const { setIsVisible: setIsScannerVisible } = useContext(ScannerContext);
  const activeNavigationItem = props.match.params[0];
  const activeCategory =
    activeNavigationItem === "reecycle" ? props.match.params.id || null : null;
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [{ data: customer }, reloadCustomer] = useCachedRequest(
    client,
    `users/me?query=${btoa(
      JSON.stringify({
        populate: { area: true },
      }),
    )}`,
    viewer,
  );
  const activeCouponUrl =
    activeNavigationItem === "reewards"
      ? !props.match.params[1] || !props.match.params.id
        ? null
        : props.match.params[1] === "available"
          ? `coupons/${props.match.params.id}?query=${encodeURIComponent(
              JSON.stringify({
                populate: { partner: true },
              }),
            )}`
          : props.match.params[1] === "my"
            ? `couponcodes/${props.match.params.id}?query=${encodeURIComponent(
                JSON.stringify({
                  populate: { partner: true },
                }),
              )}`
            : null
      : null;
  const [isUseNowPromptVisible, setIsUseNowPromptVisible] = useState(false);
  useEffect(() => setIsUseNowPromptVisible(false), [activeCouponUrl]);
  const categoriesList = useMemo(
    () =>
      viewer._.categories.filter(
        (category) => category.active && !category.hidden,
      ),
    [viewer],
  );
  const categoryPoints = useMemo(() => {
    const categories = categoriesList.map((category) => ({
      ...category,
      points: customer.categories[category.id].points || 0,
      quantity: customer.categories[category.id].quantity || 0,
    }));
    categories.sort((a, b) =>
      a.points > b.points ? -1 : a.points < b.points ? 1 : 0,
    );
    return categories;
  }, [customer, categoriesList]);
  const anyCategoryHasPoints = useMemo(
    () => categoryPoints.findIndex((category) => category.points > 0) > -1,
    [categoryPoints],
  );
  const categoryMap = useMemo(
    () =>
      categoryPoints.reduce((agr, category) => {
        agr[category.id] = category;
        return agr;
      }, {}),
    [categoryPoints],
  );
  const [redeemButton, tagsFirstOrderButton, tagsOrderButton] = useMemo(
    () => [
      Admin.compileFromLibrary([
        "ActionWithRequest",
        {
          title: "Yes",
          renderAction: (actionProps, instance) => {
            const action = instance.renderAction(actionProps);
            return <Button {...action.props} />;
          },
          getRequestConfig: (actionProps) => ({
            url: `couponcodes/${actionProps.couponCodeId}/redeem`,
            method: "post",
            data: actionProps.actionData,
          }),
          handleSuccess: (data, actionProps) => {
            // actionProps.adminPageRef.current.props.reload();
            actionProps.onSuccess(null);
          },
        },
      ]),
      Admin.compileFromLibrary([
        "ActionWithRequest",
        {
          // eslint-disable-next-line max-len
          messageSuccess:
            "Order has been placed and will be delivered in 3 working days.",
          renderAction: (actionProps, instance) => {
            const action = instance.renderAction(actionProps);
            return (
              <ModalCardButtonWrapper onClick={action.props.onClick}>
                <ModalCardButtonTitle>ORDER</ModalCardButtonTitle>
                <ModalCardButtonSubtitle>
                  Stickers and Bags
                </ModalCardButtonSubtitle>
              </ModalCardButtonWrapper>
            );
          },
          getRequestConfig: () => ({
            url: "users/tags-order",
            method: "post",
            data: { first: true },
          }),
          handleSuccess: (data, actionProps) => {
            actionProps.onSuccess();
          },
        },
      ]),
      Admin.compileFromLibrary([
        "ActionWithRequest",
        {
          // eslint-disable-next-line max-len
          messageSuccess: "Order has been placed.",
          renderAction: (actionProps, instance) => {
            const action = instance.renderAction(actionProps);
            return (
              <HeroButton
                subtitle="Order More"
                title="Ree® QR Code Stickers"
                onClick={action.props.onClick}
              />
            );
          },
          getRequestConfig: () => ({
            url: "users/tags-order",
            method: "post",
          }),
          handleSuccess: (data, actionProps) => {
            actionProps.onSuccess();
          },
        },
      ]),
    ],
    [],
  );

  return (
    <Layout>
      <GlobalStyle />
      <Body alt={activeNavigationItem === "reewards" ? 1 : 0}>
        <Content>
          <Header
            name={customer.name}
            points={!customer.points.total ? null : customer.points}
            loading={customer.bags.sorting > 0}
            level={1}
            message={
              !customer.tagsFirstOrder
                ? "Order your stickers to start…"
                : customer.bags.total === 0 && customer.points.total === 0
                  ? "Place your first order to gain points!"
                  : customer.bags.total > 0 && customer.points.total === 0
                    ? "Processing your first order!"
                    : null
            }
            image={customer.avatar ? customer.avatar.src : avatarSrc}
          />
          <AnimatePresence exitBeforeEnter>
            {activeNavigationItem === "reecycle" ? (
              <Scroll key="reecycle">
                {!customer.tagsFirstOrder ? (
                  <HeroButton
                    subtitle="Start Your"
                    title="Ree® Journey"
                    onClick={() => setIsJourneyOpen(true)}
                  />
                ) : customer.tagsCount < 5 ? (
                  tagsOrderButton.render({
                    ...adminProps,
                    loading: undefined,
                    onSuccess: () => {
                      reloadCustomer();
                    },
                  })
                ) : null}
                {anyCategoryHasPoints ? (
                  <>
                    <HorizontalScrollWrapper>
                      {categoryPoints.map((category, index) => (
                        <Fragment key={category.id}>
                          <Category
                            type="vertical"
                            image={
                              category.image
                                ? category.image.src
                                : CATEGORY_IMAGE_MAP[category.id]
                            }
                            title={category.label}
                            description={category.excerpt || "Excerpt"}
                            points={category.points}
                            quantity={category.quantity}
                            unit={
                              Types.CATEGORY_UNITS_MAP[category.unit].unitShort
                            }
                          />
                        </Fragment>
                      ))}
                    </HorizontalScrollWrapper>
                    <Space h={25} />
                  </>
                ) : null}
                <ContentType
                  title="Categories"
                  description={`${categoriesList.length} total`}
                />
                <Space h={25} />
                {categoriesList.map((category, index) => (
                  <Fragment key={category.id}>
                    <Category
                      image={category.image ? category.image.src : null}
                      title={category.label}
                      description={category.excerpt || "Excerpt"}
                      points={category.ppu}
                      unit={Types.CATEGORY_UNITS_MAP[category.unit].unitShort}
                      onClick={() =>
                        props.history.push(`/reecycle/${category.id}`)
                      }
                    />
                    {index < categoriesList.length - 1 ? (
                      <Space h={10} />
                    ) : null}
                  </Fragment>
                ))}
              </Scroll>
            ) : activeNavigationItem === "reewards" ? (
              <Scroll ref={scrollRef} key="rewards">
                <Query
                  ref={couponCodesQueryRef}
                  url={`/couponcodes?query=${encodeURIComponent(
                    JSON.stringify({
                      populate: { partner: true },
                      sort: {
                        redeemedAt: 1,
                        purchasedAt: -1,
                      },
                    }),
                  )}`}
                  client={client}
                  method="GET"
                  extractData={props.extractData}
                  // builder={props.builder}
                >
                  {(queryProps, ...args) =>
                    queryProps.data &&
                    queryProps.data.data &&
                    queryProps.data.data.data &&
                    queryProps.data.data.data.length > 0 ? (
                      <>
                        <ContentType
                          title="My Coupons"
                          description={`${queryProps.data.data.count} total`}
                        />
                        <Space h={25} />
                        <CouponsPurchasedWrapper>
                          {queryProps.data.data.data.map((item, index) => (
                            <Fragment key={item._id}>
                              {index > 0 ? <Space w={10} h={10} /> : null}
                              <Coupon
                                image={
                                  item.details.image
                                    ? item.details.image.src
                                    : null
                                }
                                color={item.details.color}
                                colorStyle={item.details.colorStyle}
                                title={item.details.name}
                                description={
                                  item.partner
                                    ? item.partner.name
                                    : item.details.partner
                                }
                                // stats={stats}
                                points={Types.decimalizeInt(item.details.price)}
                                onClick={() =>
                                  props.history.push(`/reewards/my/${item._id}`)
                                }
                                dimmed={!!item.redeemedAt}
                              />
                            </Fragment>
                          ))}
                        </CouponsPurchasedWrapper>
                        <Space h={25} />
                      </>
                    ) : null
                  }
                </Query>
                <Query
                  url={`/coupons?query=${encodeURIComponent(
                    JSON.stringify({
                      limit: 0,
                      where: {
                        available: true,
                        availableCount: { GTE: 1 },
                      },
                    }),
                  )}`}
                  client={client}
                  method="GET"
                  extractData={props.extractData}
                  // builder={props.builder}
                >
                  {(queryProps, ...args) => {
                    const count =
                      queryProps.data &&
                      queryProps.data.data &&
                      queryProps.data.data
                        ? queryProps.data.data.count
                        : 0;
                    return (
                      <ContentType
                        title="Available Coupons"
                        description={`${count} total`}
                      />
                    );
                  }}
                </Query>
                <Space h={25} />
                <CouponsAvailableWrapper>
                  <InfiniteScrollQuery
                    url="/coupons"
                    client={client}
                    method="GET"
                    extractData={props.extractData}
                    builder={props.builder}
                    queryUrl={props.queryUrl}
                    shouldReload={(oldProps, newProps) =>
                      oldProps.queryUrl !== newProps.queryUrl
                    }
                    getUrl={({ url, limit, builder }, page) =>
                      `/coupons?query=${encodeURIComponent(
                        JSON.stringify({
                          // ...builder.build(),
                          where: {
                            available: true,
                            availableCount: { GT: 0 },
                          },
                          populate: { partner: true },
                          sort: { createdAt: -1, _id: -1 },
                          skip: page * limit,
                          limit,
                        }),
                      )}`
                    }
                    getScrollParent={() => scrollRef.current}
                    renderItem={(item, index) => (
                      <Coupon
                        dimmed={!item.tiers[customer.tier].available}
                        key={item._id}
                        type="vertical"
                        image={
                          item.details.image ? item.details.image.src : null
                        }
                        color={item.details.color}
                        colorStyle={item.details.colorStyle}
                        title={item.details.name}
                        description={item.partner.name}
                        tiersAvailableStatus={item.tiersAvailableStatus}
                        points={Types.decimalizeInt(item.details.price)}
                        onClick={() => {
                          if (item.tiers[customer.tier].available) {
                            props.history.push(
                              `/reewards/available/${item._id}`,
                            );
                          } else {
                            Admin.showMessage(
                              "Only available for VIP customers",
                              "error",
                            );
                          }
                        }}
                      />
                    )}
                  />
                </CouponsAvailableWrapper>
              </Scroll>
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: "1 0 auto",
                  height: "100vh",
                }}
              />
            )}
          </AnimatePresence>
        </Content>
        <Navigation
          items={ITEMS}
          active={activeNavigationItem}
          onClick={(value) => {
            if (value === "scan") {
              setIsScannerVisible(true);
            } else {
              if (reloadCustomer) {
                reloadCustomer();
              }
              props.history.push(`/${value}`);
            }
          }}
        />
      </Body>
      <ModalCard
        id="start-your-journey"
        onBackdropClick={() => setIsJourneyOpen(false)}
        onPullDown={() => setIsJourneyOpen(false)}
        spacerHeight="20vh"
        backdropColor={[theme.colors.brandLight, theme.colors.brandDark]}
        backdropOpacity={0.85}
        ComponentSpacer={(subprops) => (
          <CouponsModalSpacer {...subprops} image={reeWhiteSrc} />
        )}
      >
        {isJourneyOpen ? (
          <>
            <ModalTitle title="Start Your Ree® Journey" />
            <Space h={20} />

            <Paragraph fontSize={14} opacity={0.8}>
              Thank you for becoming a <strong>Ree</strong>
              cycler!
            </Paragraph>
            <Space h={20} />
            <Paragraph fontSize={14} opacity={0.8}>
              We need to get your Ree bags and QR code stickers to you now. So
              order them with the button below and they should be with you
              within <strong>3 working days</strong>.
            </Paragraph>
            <Space h={20} />
            <Paragraph fontSize={14} opacity={0.8}>
              Once they arrive you&apos;ll be able to start scanning and sending
              us your recyclables.
            </Paragraph>
            <Space h={30} />
            {tagsFirstOrderButton.render({
              ...adminProps,
              loading: undefined,
              onSuccess: () => {
                reloadCustomer();
                setIsJourneyOpen(false);
              },
            })}
            <Space h={25} />
          </>
        ) : null}
      </ModalCard>
      <ModalCard
        id={activeCategory || "category"}
        onBackdropClick={() => props.history.push("/reecycle")}
        onPullDown={() => props.history.push("/reecycle")}
        spacerHeight="20vh"
        backdropColor={[theme.colors.brandLight, theme.colors.brandDark]}
        backdropOpacity={0.85}
        ComponentSpacer={(subprops) => (
          <CouponsModalSpacer
            {...subprops}
            image={
              categoryMap[activeCategory].image
                ? categoryMap[activeCategory].image.src
                : CATEGORY_IMAGE_MAP[activeCategory]
            }
          />
        )}
      >
        {activeCategory ? (
          <>
            <ModalTitle
              title={categoryMap[activeCategory].label}
              points={categoryMap[activeCategory].ppu}
              unit={
                Types.CATEGORY_UNITS_MAP[categoryMap[activeCategory].unit]
                  .unitShort
              }
            />
            {categoryMap[activeCategory].description ? (
              <>
                <Space h={20} />
                <Paragraph fontSize={14} opacity={0.8}>
                  {categoryMap[activeCategory].description}
                </Paragraph>
              </>
            ) : null}
            {categoryMap[activeCategory].subcategories.length > 0 ? (
              <>
                <Space h={20} />
                <List>
                  <Title fontSize={16} opacity={0.8}>
                    What can you <strong>Ree</strong>
                    aly give us?
                  </Title>
                  <Space h={10} />
                  {categoryMap[activeCategory].subcategories.map((item) => (
                    <ListItem key={item.subcategory}>
                      <Paragraph fontSize={14} opacity={0.8}>
                        {item.subcategory}
                      </Paragraph>
                    </ListItem>
                  ))}
                </List>
              </>
            ) : null}
            {categoryMap[activeCategory].gallery.length > 0 ? (
              <>
                <Space h={20} />
                <Gallery images={categoryMap[activeCategory].gallery} />
              </>
            ) : null}
            {categoryMap[activeCategory].notes ? (
              <>
                <Space h={20} />
                <Title fontSize={16} opacity={0.8}>
                  Notes:
                </Title>
                <Space h={10} />
                <Paragraph fontSize={14} opacity={0.8}>
                  {categoryMap[activeCategory].notes}
                </Paragraph>
              </>
            ) : null}
            {categoryMap[activeCategory].tip ? (
              <>
                <Space h={20} />
                <TipWrapper>
                  <Title fontSize={16} opacity={0.8}>
                    Ree® Tip:
                  </Title>
                  <Space h={10} />
                  <Paragraph fontSize={14} opacity={0.8}>
                    {categoryMap[activeCategory].tip}
                  </Paragraph>
                </TipWrapper>
              </>
            ) : null}
            {categoryMap[activeCategory].youtubeUrl ? (
              <>
                <Space h={20} />
                <Button
                  as="a"
                  target="_blank"
                  href={categoryMap[activeCategory].youtubeUrl}
                >
                  Learn more on YouTube
                </Button>
              </>
            ) : null}
            <Space h={20} />
            <div style={{ margin: "auto" }}>
              <ButtonCancel onClick={() => props.history.push("/reecycle")} />
            </div>
            <Space h={25} />
          </>
        ) : null}
      </ModalCard>
      <Query
        url={activeCouponUrl}
        skip={!activeCouponUrl}
        client={client}
        method="GET"
        extractData={props.extractData}
        // builder={props.builder}
      >
        {(queryProps, ...args) => {
          const coupon =
            queryProps.data && queryProps.data.data
              ? queryProps.data.data
              : null;
          const [color1, color2, colorAngle, colorText, colorCode] =
            getCouponColors(
              coupon ? coupon.details.color : "#fff",
              coupon ? coupon.details.colorStyle : 0,
            );
          return (
            <>
              <ModalCard
                id={coupon ? coupon._id : "coupon"}
                onBackdropClick={() => props.history.push("/reewards")}
                onPullDown={() => props.history.push("/reewards")}
                spacerHeight="20vh"
                backdropColor={`linear-gradient(${colorAngle}deg, ${
                  color1
                } 0%, ${color2} 100%)`}
                backdropOpacity={0.85}
                ComponentSpacer={(subprops) => (
                  <CouponsModalSpacer
                    title={coupon ? coupon.details.name : null}
                    image={coupon.details.image.src}
                    style={{ color: colorText }}
                    {...subprops}
                  />
                )}
              >
                {coupon ? (
                  <CouponCardModalContent
                    key={coupon._id}
                    coupon={coupon}
                    onRedeem={() => setIsUseNowPromptVisible(true)}
                    onClose={() => {
                      props.history.push("/reewards");
                      if (reloadCustomer) {
                        reloadCustomer();
                      }
                      if (couponCodesQueryRef.current) {
                        couponCodesQueryRef.current.reload();
                      }
                    }}
                    colorCode={colorCode}
                    colorText={colorText}
                    adminProps={adminProps}
                  />
                ) : null}
              </ModalCard>
              <ModalCard
                id={`use-now-prompt-${coupon ? coupon._id : "coupon"}`}
                onBackdropClick={() => setIsUseNowPromptVisible(false)}
                onPullDown={() => setIsUseNowPromptVisible(false)}
                spacerHeight="20vh"
                backdropColor="#000"
                backdropOpacity={0.6}
              >
                {coupon && isUseNowPromptVisible ? (
                  <>
                    <Title>Are you sure?</Title>
                    <Space h={20} />
                    <Paragraph>
                      Please make sure to use this coupon only when checking
                      out!
                    </Paragraph>
                    <Space h={30} />
                    <ModalButtonsHorizontalWrapper>
                      {redeemButton.render({
                        ...adminProps,
                        loading: undefined,
                        couponCodeId: coupon ? coupon._id : null,
                        actionData: { undo: false },
                        onSuccess: async () => {
                          try {
                            await queryProps.reload();
                            if (couponCodesQueryRef.current) {
                              couponCodesQueryRef.current.reload();
                            }
                            setIsUseNowPromptVisible(false);
                          } catch (error) {
                            // eslint-disable-next-line no-console
                            console.log("error redeeming code:", error);
                          }
                        },
                      })}
                      <Space w={10} />
                      <Button
                        style={{ opacity: 0.7 }}
                        onClick={() => setIsUseNowPromptVisible(false)}
                      >
                        No
                      </Button>
                    </ModalButtonsHorizontalWrapper>
                  </>
                ) : null}
              </ModalCard>
            </>
          );
        }}
      </Query>
      {viewer.role === "CUSTOMER" ? (
        <OnBoarding
          isOpen={!customer.onboarded}
          tier={
            customer.tierConfig?.pickup &&
            (!customer.area || !customer.area.serviced)
              ? "REGULAR"
              : customer.tier
          }
          onClose={async () => {
            try {
              await client.request("users/onboarding", {
                method: "POST",
                data: { onboarded: true },
              });
              reloadCustomer();
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log(error);
            }
          }}
        />
      ) : null}
    </Layout>
  );
}
