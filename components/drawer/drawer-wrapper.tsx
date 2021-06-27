import React, { useEffect, useRef } from 'react'
import useTheme from '../use-theme'
import CssTransition from '../shared/css-transition'
import { isChildElement } from '../utils/collections'
import useScaleable from '../use-scaleable'

interface Props {
  className?: string
  visible?: boolean
}

const defaultProps = {
  className: '',
  visible: false,
}

export type DrawerWrapperProps = Props

const DrawerWrapper: React.FC<React.PropsWithChildren<DrawerWrapperProps>> = ({
  className,
  children,
  visible,
  ...props
}: React.PropsWithChildren<DrawerWrapperProps> & typeof defaultProps) => {
  const theme = useTheme()
  const { SCALES } = useScaleable()
  const modalContent = useRef<HTMLDivElement>(null)
  const tabStart = useRef<HTMLDivElement>(null)
  const tabEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) return
    const activeElement = document.activeElement
    const isChild = isChildElement(modalContent.current, activeElement)
    if (isChild) return
    tabStart.current && tabStart.current.focus()
  }, [visible])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isTabDown = event.keyCode === 9
    if (!visible || !isTabDown) return
    const activeElement = document.activeElement
    if (event.shiftKey) {
      if (activeElement === tabStart.current) {
        tabEnd.current && tabEnd.current.focus()
      }
    } else {
      if (activeElement === tabEnd.current) {
        tabStart.current && tabStart.current.focus()
      }
    }
  }

  return (
    <CssTransition name="wrapper" visible={visible} clearTime={300}>
      <div
        className={`wrapper ${className}`}
        role="dialog"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        ref={modalContent}
        {...props}>
        <div tabIndex={0} className="hide-tab" aria-hidden="true" ref={tabStart} />
        {children}
        <div tabIndex={0} className="hide-tab" aria-hidden="true" ref={tabEnd} />
        <style jsx>{`
          .wrapper {
            max-width: 100%;
            vertical-align: middle;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            box-sizing: border-box;
            background-color: ${theme.palette.background};
            color: ${theme.palette.foreground};
            border-radius: ${theme.layout.radius};
            box-shadow: ${theme.expressiveness.shadowLarge};
            opacity: 0;
            outline: none;
            transform: translate3d(0px, -30px, 0px);
            transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s,
              transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0s;
            width: 100%;
            font-size: ${SCALES.font(1)};
            height: ${SCALES.height(1, 'auto')};
            --modal-wrapper-padding-left: ${SCALES.pl(1.3125)};
            --modal-wrapper-padding-right: ${SCALES.pr(1.3125)};
            padding: ${SCALES.pt(1.3125)} var(--modal-wrapper-padding-right)
              ${SCALES.pb(1.3125)} var(--modal-wrapper-padding-left);
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
          }

          .wrapper-enter {
            opacity: 0;
            transform: translate3d(0px, -30px, 0px);
          }

          .wrapper-enter-active {
            opacity: 1;
            transform: translate3d(0px, 0px, 0px);
          }

          .wrapper-leave {
            opacity: 1;
            transform: translate3d(0px, 0px, 0px);
          }

          .wrapper-leave-active {
            opacity: 0;
            transform: translate3d(0px, -30px, 0px);
          }

          .hide-tab {
            outline: none;
            overflow: hidden;
            width: 0;
            height: 0;
            opacity: 0;
          }
        `}</style>
      </div>
    </CssTransition>
  )
}

DrawerWrapper.defaultProps = defaultProps
DrawerWrapper.displayName = 'GeistDrawerWrapper'
export default DrawerWrapper
