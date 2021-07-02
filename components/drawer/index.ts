import Drawer from './drawer'
import ModalTitle from '../modal/modal-title'
import ModalSubtitle from '../modal/modal-subtitle'
import ModalContent from '../modal/modal-content'

export type DrawerComponentType = typeof Drawer & {
  Title: typeof ModalTitle
  Subtitle: typeof ModalSubtitle
  Content: typeof ModalContent
}

export type { DrawerProps } from './drawer'
export type {
  ModalTitleProps as DrawerTitleProps,
  ModalSubtitleProps as DrawerSubtitleProps,
  ModalContentProps as DrawerContentProps,
} from '../modal'
export default Drawer as DrawerComponentType
