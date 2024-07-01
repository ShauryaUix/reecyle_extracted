/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import getKey from "lodash/get";

import { useState, useEffect } from "react";
import styled from "styled-components";

import Button from "antd/lib/button";
import Popover from "antd/lib/popover";

import Admin from "hive-admin";
import Input from "hive-admin/src/components/Input/Input";
import FieldReact from "hive-admin/src/components/FieldReact";

const InputDisplay = styled(Input)`
  input,
  .ant-input-prefix {
    pointer-events: none !important;
    user-select: none !important;
  }
`;

const InputUpdate = styled(Input)`
  text-align: center;
  input {
    &:focus::placeholder {
      color: transparent !important;
    }
  }
`;

const Action = styled.div`
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.less.primaryColor};
  }
`;

const PopoverWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 150px;
`;

function FieldTagsCountComponent({ value: initialValue, userId, client }) {
  const [value, setValue] = useState(initialValue);
  const [updateValue, setUpdateValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => setValue(initialValue), [initialValue]);
  return (
    <InputDisplay
      prefix="Count:"
      value={value}
      addonAfter={
        <Popover
          visible={isVisible}
          onVisibleChange={(visible) => setIsVisible(visible)}
          content={
            <PopoverWrapper>
              <div>Enter the number of tags to add to the curent count.</div>
              <InputUpdate
                value={updateValue}
                placeholder="0"
                onChange={(event) => setUpdateValue(event.target.value)}
              />
              <Button
                size="default"
                type="primary"
                onClick={async () => {
                  try {
                    const response = await client.request({
                      url: `users/${userId}/update-tags-count`,
                      method: "POST",
                      data: { update: updateValue },
                    });
                    const count = response.data.tagsCount;
                    setValue(count);
                    setIsVisible(false);
                    Admin.showMessage("Tags count updated!");
                  } catch (error) {
                    if (error) {
                      Admin.showMessage(
                        getKey(error, "response.data.message", error.message) ||
                          "Oops, please try again",
                        "error",
                      );
                      // eslint-disable-next-line no-console
                      console.log(error);
                    }
                  }
                }}
              >
                OK
              </Button>
            </PopoverWrapper>
          }
        >
          <Action>+ / -</Action>
        </Popover>
      }
    />
  );
}

Admin.addToLibrary("FieldTagsCount", (config = {}) =>
  FieldReact.create({
    label: null,
    ...config,
    renderContent: (props) => (
      <FieldTagsCountComponent
        value={(props.data || {}).tagsCount || 0}
        userId={props.data ? props.data._id : null}
        client={props.client}
      />
    ),
  }),
);
