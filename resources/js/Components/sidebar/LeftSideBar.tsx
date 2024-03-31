import React from 'react';
import FrontSideBar from './FrontSideBar';
import { AdvertiseDTO } from '../types/AdvertiseTypes';
type Props = {
  advertisements: AdvertiseDTO[];
};
export default function LeftSideBar(props: Props) {
  const { advertisements } = props;
  return (
    <>
      <FrontSideBar
        advertisements={advertisements.filter((ad) =>
          ad.arrangement_name.includes('左'),
        )}
      />
    </>
  );
}
