import React, { MouseEvent, useEffect, useState } from 'react'
import useScaleable, { withScaleable } from '../use-scaleable'
import usePortal from '../utils/use-portal'
import useBodyScroll from '../utils/use-body-scroll'
import useKeyboard, { KeyCode } from '../use-keyboard'
import { createPortal } from 'react-dom'
import Backdrop from '../shared/backdrop'
import DrawerWrapper from './drawer-wrapper'

interface Props {
  visible?: boolean
  keyboard?: boolean
  disableBackdropClick?: boolean
  onClose?: () => void
  onContentClick?: (event: MouseEvent<HTMLElement>) => void
  wrapClassName?: string
}

const defaultProps = {
  wrapClassName: '',
  keyboard: true,
  disableBackdropClick: false,
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type DrawerProps = Props & NativeAttrs

const DrawerComponent: React.FC<React.PropsWithChildren<DrawerProps>> = ({
  visible: customVisible,
  keyboard,
  disableBackdropClick,
  onClose,
  onContentClick,
  wrapClassName,
  children,
  ...props
}: React.PropsWithChildren<DrawerProps> & typeof defaultProps) => {
  const portal = usePortal('drawer')
  const { SCALES } = useScaleable()
  const [visible, setVisible] = useState<boolean>(false)
  const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })

  const closeDrawer = () => {
    onClose && onClose()
    setVisible(false)
    setBodyHidden(false)
  }

  useEffect(() => {
    if (typeof customVisible === 'undefined') return
    setVisible(customVisible)
    setBodyHidden(customVisible)
  }, [customVisible])

  const { bindings } = useKeyboard(
    () => {
      keyboard && closeDrawer()
    },
    KeyCode.Escape,
    {
      disableGlobalEvent: true,
    },
  )

  const closeFromBackdrop = () => {
    if (disableBackdropClick) return
    closeDrawer()
  }

  if (!portal) return null
  return createPortal(
    <Backdrop
      onClick={closeFromBackdrop}
      onContentClick={onContentClick}
      visible={visible}
      width={SCALES.width(26)}
      {...bindings}>
      <DrawerWrapper visible={visible} className={wrapClassName} {...props}>
        {children}
      </DrawerWrapper>
    </Backdrop>,
    portal,
  )
}

DrawerComponent.defaultProps = defaultProps
DrawerComponent.displayName = 'GeistDrawer'
const Drawer = withScaleable(DrawerComponent)
export default Drawer
