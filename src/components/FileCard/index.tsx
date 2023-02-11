import Zoom from 'react-medium-image-zoom';
import styles from './styles.module.css';
import { Menu } from '@headlessui/react';
import { ArrowsLeftRight, DotsThreeVertical, DownloadSimple, Question, Textbox, TrashSimple } from 'phosphor-react';
import { SystemProps } from '../../hooks/useSystemsCollection';

interface FileCardProps {
  item: SystemProps;
  hideBlurred?: boolean;
  renameMethod: () => void;
  replaceMethod: () => void;
  exportMethod: () => void;
  deleteMethod: () => void;
}

export function FileCard({ item, hideBlurred, renameMethod, replaceMethod, exportMethod, deleteMethod }: FileCardProps) {
  return (
    <li className={[styles.cardContainer, 'group'].join(' ')}>
      <div className={[styles.cardImageWrapper, hideBlurred ? 'grid-cols-1' : 'grid-cols-[2fr_1fr]'].join(' ')}
        title={`ES theme: ${item.theme}\nName: ${item.fullName}\nManufacturer: ${item.manufacturer}`}>
        <Zoom zoomMargin={32}
          zoomImg={{ src: item.file.normal }}>
          <img className={[styles.cardSystemImg, 'rounded-l aspect-video'].join(' ')}
            src={item.file.thumbnail || item.file.normal} />
        </Zoom>
        {!hideBlurred && (
          <Zoom zoomMargin={32}>
            <img className={[styles.cardSystemImg, 'rounded-r aspect-auto'].join(' ')}
              src={item.file.blurred} />
          </Zoom>
        )}
      </div>
      <div className='flex items-center mt-1'>
        <span className={styles.cardSystemName}>
          {item.theme}
        </span>
        <Menu as='div'
          className='relative'>
          <Menu.Button as='button'
            className={styles.menuListButton}>
            <DotsThreeVertical size={16}
              weight='bold' />
          </Menu.Button>
          <Menu.Items className={styles.menuSurface}>
            <Menu.Item>
              {({ active }) => (
                <button className={[styles.menuItem, active ? 'bg-stone-500' : ''].join(' ')}
                  onClick={renameMethod}
                  title={'Rename ' + item.theme}>
                  <Textbox size={16}
                    weight='bold' />
                  <span className={styles.menuItemLabel}>
                    {'Rename'}
                  </span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button className={[styles.menuItem, active ? 'bg-stone-500' : ''].join(' ')}
                  onClick={replaceMethod}
                  title='Replace current saved image with the current image loaded on canvas'>
                  <ArrowsLeftRight size={16}
                    weight='bold'
                    className='shrink-0' />
                  <span className={styles.menuItemLabel}>
                    {'Replace'}
                  </span>
                  <Question size={16}
                    weight='bold'
                    className='opacity-50' />
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button className={[styles.menuItem, active ? 'bg-stone-500' : ''].join(' ')}
                  onClick={exportMethod}
                  title={`Download ${item.theme} and its blurred version as a ZIP file.`}>
                  <DownloadSimple size={16}
                    weight='bold' />
                  <span className={styles.menuItemLabel}>
                    {'Export ' + item.theme}
                  </span>
                </button>
              )}
            </Menu.Item>
            <hr className='my-1 border-neutral-500' />
            <Menu.Item>
              {({ active }) => (
                <button className={[styles.menuItem, active ? 'bg-stone-500' : ''].join(' ')}
                  onClick={deleteMethod}>
                  <TrashSimple size={16}
                    weight='bold' />
                  <span className={styles.menuItemLabel}>
                    {'Delete'}
                  </span>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </li>
  );
}
