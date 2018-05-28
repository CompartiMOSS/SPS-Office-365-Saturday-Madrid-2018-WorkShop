import * as React from "react";
import styles from "./HelloAlmSpfx.module.scss";
import { IHelloAlmSpfxProps } from "./IHelloAlmSpfxProps";
import { escape } from "@microsoft/sp-lodash-subset";

export default class HelloAlmSpfx extends React.Component<IHelloAlmSpfxProps, {}> {
  public render(): React.ReactElement<IHelloAlmSpfxProps> {
    return (
      <div className={ styles.helloAlmSpfx }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Version: 1.1.2</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
