import React, { forwardRef, useState } from "react";
import classNames from "classnames";
import { MdAdd } from "react-icons/md";

import { Handle, Remove } from "../Item";

import styles from "./Container.module.scss";
import { Button, Input, Modal } from "antd";

export interface Props {
  addItems?: boolean;
  children: React.ReactNode;
  columns?: number;
  label?: string;
  id?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
  handleItems?: any;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      addItems,
      handleItems,
      id,
      ...props
    }: Props,
    ref
  ) => {
    const Component = onClick ? "button" : "div";
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [image, setImage] = useState<string | undefined>();
    const [playerName, setPlayerName] = useState<string | undefined>();
    // console.log("Container", children);
    return (
      <>
        <Component
          {...props}
          ref={ref}
          style={
            {
              ...style,
              "--columns": columns,
            } as React.CSSProperties
          }
          className={classNames(
            styles.Container,
            unstyled && styles.unstyled,
            horizontal && styles.horizontal,
            hover && styles.hover,
            placeholder && styles.placeholder,
            scrollable && styles.scrollable,
            shadow && styles.shadow
          )}
          onClick={onClick}
          tabIndex={onClick ? 0 : undefined}
        >
          {label ? (
            <div className={styles.Header}>
              {label}
              <div className={styles.Actions}>
                {onRemove ? <Remove onClick={onRemove} /> : undefined}
                {addItems && (
                  <Button
                    style={{
                      opacity: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    icon={<MdAdd />}
                    onClick={() => setIsOpenModal((prev) => !prev)}
                  />
                )}
                <Handle {...handleProps} />
              </div>
            </div>
          ) : null}
          {placeholder ? children : <ul>{children}</ul>}
        </Component>
        <Modal
          open={isOpenModal}
          onOk={() =>
            handleItems &&
            handleItems((prev) => {
              console.log(playerName, image);
              const newValue = {
                ...prev,
                [id]: [
                  ...prev[id],
                  {
                    backgroundImage: URL.createObjectURL(image),
                    playerName,
                  },
                ],
              };
              setImage(undefined);
              setPlayerName(undefined);
              return newValue;
            })
          }
          onCancel={() => setIsOpenModal((prev) => !prev)}
          closable={true}
          title={"Adicionar"}
        >
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            type={"text"}
            required={true}
          />
          <Input
            type={"file"}
            accept="image/*"
            required={true}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Modal>
      </>
    );
  }
);
