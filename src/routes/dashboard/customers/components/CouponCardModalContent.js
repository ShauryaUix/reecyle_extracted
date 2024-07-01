import React, { useMemo } from "react";
import styled, { useTheme } from "styled-components";

// import Button from 'antd/lib/button';

import Barcode from "react-barcode";
import QRCode from "react-qr-code";

import Admin from "hive-admin";

import AntdStarOutlined from "@ant-design/icons/StarOutlined";

import Space from "./Space";
import ModalTitle from "./ModalTitle";
import { Paragraph } from "./Text";
import Button, { ButtonCancel } from "./Button";
import Gallery from "./Gallery";

import Types from "../../../../common/modules/types";

// const ModalCardButton = styled(Button)`
//   width: 100%;
//   /* max-width: 200px; */
//   border-radius: 1000px !important;
// `;

const ModalCardButton = styled(Button)``;

// eslint-disable-next-line arrow-body-style
const CardCodeWrapper = styled.div.attrs((props) => {
  return {
    style: {
      backgroundColor: props.color,
    },
  };
})`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 4px;
  &[data-type="QRCODE"] {
    width: 97px;
    height: 97px;
    padding: 6px;
    > svg {
      transform-origin: 0px 0px;
      transform: scale(0.25);
    }
  }
  &[data-type="TEXT"] {
    text-align: center;
    letter-spacing: 2px;
    font-size: 18px;
    word-wrap: break-word;
    padding: 0px 6px;
  }
  &[data-type="BARCODE"] {
    display: flex;
    padding: 6px;
  }
`;

const TextCode = styled.code``;

export const TierStar = styled(AntdStarOutlined)`
  font-size: 26px;
  margin-top: 2px;
  padding-left: 20px;
`;

export default function CouponCardModalContent({
  coupon,
  onClose,
  onRedeem,
  adminProps,
  colorCode,
  colorText,
}) {
  const theme = useTheme();
  const [purchaseButton, redeemButton] = useMemo(
    () => [
      Admin.compileFromLibrary([
        "ActionWithRequest",
        {
          title: "Buy Now!",
          renderAction: (actionProps, instance) => {
            const action = instance.renderAction(actionProps);
            return <ModalCardButton {...action.props} />;
          },
          getRequestConfig: () => ({
            url: `coupons/${coupon._id}/purchase`,
            method: "post",
          }),
          handleSuccess: (data, actionProps) => {
            // actionProps.adminPageRef.current.props.reload();
            actionProps.onClose(null);
          },
        },
      ]),
      Admin.compileFromLibrary([
        "ActionWithRequest",
        {
          title: "Mark as unused!",
          renderAction: (actionProps, instance) => {
            const action = instance.renderAction(actionProps);
            return <ModalCardButton {...action.props} />;
          },
          getRequestConfig: (actionProps) => ({
            url: `couponcodes/${coupon._id}/redeem`,
            method: "post",
            data: { undo: true },
          }),
          handleSuccess: (data, actionProps) => {
            // actionProps.adminPageRef.current.props.reload();
            actionProps.onClose(null);
          },
        },
      ]),
    ],
    [coupon],
  );
  const {
    type: codeType,
    format: codeFormat,
    // generate,
  } =
    Types.COUPON_TYPES_MAP[
      coupon.details.type || Types.COUPON_TYPES_LIST[0].id
    ];
  return (
    <>
      <ModalTitle
        title={coupon.details.name}
        icon={
          ["PRO_PREMIUM", "PREMIUM"].includes(coupon.tiersAvailableStatus) ? (
            <TierStar style={{ color: coupon.details.color }} />
          ) : null
        }
        customColor={coupon.details.color}
        points={Types.decimalizeInt(coupon.details.price)}
        unit={coupon.details.unit}
        label={coupon.partner ? coupon.partner.name : coupon.details.partner}
      />
      {coupon.details.terms ? (
        <>
          <Space h={20} />
          <Paragraph style={{ fontWeight: 700 }} opacity={0.8}>
            {coupon.details.terms}
          </Paragraph>
        </>
      ) : null}
      {coupon.details.description ? (
        <>
          <Space h={20} />
          <Paragraph opacity={0.8}>{coupon.details.description}</Paragraph>
        </>
      ) : null}
      {coupon.details.gallery && coupon.details.gallery.length > 0 ? (
        <>
          <Space h={20} />
          <Gallery images={coupon.details.gallery} />
        </>
      ) : null}
      {coupon.code ? (
        coupon.redeemedAt ? (
          <>
            <Space h={20} />
            <CardCodeWrapper
              color={colorCode}
              data-type={codeType}
              style={
                codeFormat === "EAN13"
                  ? { transform: "translateX(-16px)" }
                  : undefined
              }
            >
              {codeType === "QRCODE" ? (
                <QRCode
                  value={coupon.code}
                  size={85 * 4}
                  fgColor={theme.colors.text.dark}
                  bgColor="transparent"
                />
              ) : codeType === "TEXT" ? (
                <TextCode>{coupon.code}</TextCode>
              ) : codeType === "BARCODE" ? (
                <Barcode
                  value={coupon.code}
                  width={2.5}
                  height={40}
                  lineColor={theme.colors.text.dark}
                  format={codeFormat}
                  margin={0}
                  font="Avenir Next"
                  fontSize={14}
                  fontOptions="600"
                  background="transparent"
                />
              ) : null}
            </CardCodeWrapper>
            <Space h={50} />
            {redeemButton.render({
              ...adminProps,
              onClose,
            })}
          </>
        ) : (
          <>
            <Space h={20} />
            <Button onClick={onRedeem}>Use now!</Button>
          </>
        )
      ) : (
        <>
          <Space h={20} />
          {purchaseButton.render({
            ...adminProps,
            onClose,
          })}
        </>
      )}
      <Space h={20} />
      <div style={{ margin: "auto" }}>
        <ButtonCancel onClick={onClose} />
      </div>
      <Space h={25} />
    </>
  );
}
