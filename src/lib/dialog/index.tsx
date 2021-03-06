import React, {Fragment, ReactElement, ReactFragment, ReactNode} from 'react';
import ReactDOM from 'react-dom';
import '../static/icons/index.js';
import classes from '../utils/classes';
import Button from '../button';
import './index.scss';

/*
* 难点:
* 1. Dialog组件，使用React.createPortal()，传送至body下。
* 2. createModal()方法，将关闭弹窗的方法返回，提供给调用者。
* 3. React.render()再次调用时，组件不能和上次是同一个对象，否则将不触发更新。
* */

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean,
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onCancel?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void,
  titleNode?: ReactNode,
  buttons?: ReactElement | ReactFragment,
}

interface CreateModalParams {
  content: ReactNode,
  buttons?: ReactElement | ReactFragment,
  title?: ReactNode
}

interface ModalParams {
  buttons?: ReactElement | ReactFragment,
  title?: ReactNode
  content: ReactNode,
}

interface ConfirmParams {
  onConfirm: () => void,
  onCancel: () => void,
  content: ReactNode,
}

interface AlertParams {
  content: ReactNode,
  onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

const gradiences = [
  `linear-gradient(to right bottom, #e0fefb 0%, #f2e2e0 100%)`,
  `linear-gradient(to right bottom, #A1FFCE, #FAFFD1)`,
  `linear-gradient(to right bottom, #1c92d2, #f2fcfe)`,
  `linear-gradient(to right bottom, #4AC29A, #BDFFF3)`
];

const Dialog: React.FunctionComponent<DialogProps> = props => {
  const {
    className, visible, children, onConfirm, titleNode, buttons,
    onCancel, ...restProps
  } = props;

  const randomGradience = gradiences[Math.floor(Math.random() * gradiences.length)];

  const defaultButtons = (
    <Fragment>
      <Button className={classes('gui-cancel ', 'gui-button')}
              onClick={(event) => {
                onConfirm && onConfirm(event);
              }}
              colortype={'red'}>取消</Button>
      <Button className={classes('gui-confirm', 'gui-button')}
              onClick={(event) => {
                onCancel && onCancel(event);
              }}
              colortype={'blue'}>确定</Button>
    </Fragment>
  );

  const dialog = (
    <Fragment>
      <div className="gui-dialog-mask"
           onClick={(event) => {
             onCancel && onCancel(event);
           }}/>
      <div className={classes(`gui-dialog`, className)} {...restProps}
           style={{'backgroundImage': randomGradience}}>
        {titleNode && <header className="gui-title">{titleNode}</header>}
        <main className="gui-content">{children}</main>
        <footer className="gui-buttons">
          {buttons ? buttons : defaultButtons}
        </footer>
      </div>
    </Fragment>
  );
  return visible ? ReactDOM.createPortal(dialog, document.body) : null;
};

// const createModal = (content: ReactNode, buttons?: ReactElement | ReactFragment, title?: ReactNode) => {
const createModal = ({content, buttons, title}: CreateModalParams) => {
  const container = document.createElement('div');
  container.classList.add('gui-dialog-container');
  document.body.appendChild(container);
  const dialog = (
    <Dialog visible={true}
            buttons={buttons}
            onCancel={() => {
              closeModal();
            }}
            titleNode={title}>
      {content}
    </Dialog>
  );
  const closeModal = () => {
    ReactDOM.render(React.cloneElement(dialog, {visible: false}), container);
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  };
  ReactDOM.render(dialog, container);
  return closeModal;
};

const modal = ({content, buttons, title}: ModalParams) => {
  return createModal({content, buttons, title});
};

const alert = ({content, onConfirm}: AlertParams) => {
  const closeModal = createModal({
    content,
    buttons: (
      <Button onClick={(event) => {
        onConfirm && onConfirm(event);
        closeModal();
      }}>确认</Button>
    )
  });
};

const confirm = ({onConfirm, onCancel, content}: ConfirmParams) => {
  const buttons = (
    <Fragment>
      <Button className={classes('gui-cancel ', 'gui-button')}
              onClick={onCancel}
              colortype={'red'}>取消</Button>
      <Button className={classes('gui-confirm', 'gui-button')}
              onClick={onConfirm}
              colortype={'blue'}>确定</Button>
    </Fragment>
  );
  return createModal({content, buttons});
};


export {modal, alert, confirm};
export default Dialog;
