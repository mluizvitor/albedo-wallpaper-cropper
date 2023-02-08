import Zoom from 'react-medium-image-zoom';
import styles from './styles.module.css';
import { Menu } from '@headlessui/react';
import { ArrowsLeftRight, DotsThreeVertical, DownloadSimple, Question, Textbox, TrashSimple } from 'phosphor-react';

interface FileCardProps {
  normalSrc: string;
  blurredSrc: string;
  itemLabel: string;
  renameMethod: () => void;
  replaceMethod: () => void;
  exportMethod: () => void;
  deleteMethod: () => void;
}

export function FileCard({ normalSrc, blurredSrc, itemLabel, renameMethod, replaceMethod, exportMethod, deleteMethod }: FileCardProps) {
  return (
    <li className={[styles.cardContainer, 'group'].join(' ')}>
      <div className={styles.cardImageWrapper}>
        <Zoom zoomMargin={32}>
          <img className={[styles.cardSystemImg, 'rounded-l aspect-video'].join(' ')}
            src={normalSrc} />
        </Zoom>
        <Zoom zoomMargin={32}>
          <img className={[styles.cardSystemImg, 'rounded-r aspect-auto'].join(' ')}
            src={blurredSrc} />
        </Zoom>
      </div>
      <div className='flex items-center mt-1'>
        <span className={styles.cardSystemName}
          title={itemLabel}>
          {itemLabel}
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
                  title={'Rename ' + itemLabel}>
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
                  title={`Download ${itemLabel} and its blurred version as a ZIP file.`}>
                  <DownloadSimple size={16}
                    weight='bold' />
                  <span className={styles.menuItemLabel}>
                    {'Export ' + itemLabel}
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
