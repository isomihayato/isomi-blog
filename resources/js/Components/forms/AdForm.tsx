import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BasicSelect from '../inputs/BasicSelect';
import ChipSelect from '../inputs/ChipSelect';
import { Box, Fab, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { getAdSelectData } from '../axios/axiosArticleAd';

const generateUniqueId = (id) =>
  id + '_' + Math.random().toString(36).substr(2, 9);

type Props = {
  setSubmitFormData: React.Dispatch<
    React.SetStateAction<{ id: string; ad: string; place: string[] }[]>
  >;
  defaultData?: { id: string; ad: string; place: string[] }[];
};
export default function AdForm(props: Props) {
  const { setSubmitFormData, defaultData } = props;
  const [formData, setFormData] = useState([
    { id: generateUniqueId(0), ad: '', place: [] },
  ]);
  const [selectData, setSelectData] = useState<
    { label: string; value: string; content: string }[]
  >([]);
  const [arrengeSelectData, setArrengeSelectData] = useState([]);
  useEffect(() => {
    getAdSelectData(
      (res) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSelectData(res.data.adSelectData);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setArrengeSelectData(res.data.arrengeSelectData);
      },
      (res) => {
        console.log(res);
      },
    );
  }, []);

  useEffect(() => {
    const _d =
      defaultData == undefined || defaultData.length === 0
        ? formData
        : [...defaultData];
    console.log(defaultData);

    setFormData(_d);
  }, [defaultData]);

  const findHash = (hash, key, value) => {
    return hash.find((data) => data[key] === value);
  };

  return (
    <>
      <Box>
        <Grid container>
          {formData.map((data, index) => {
            const ad = findHash(selectData, 'value', formData[index].ad);

            return (
              <React.Fragment key={data.id}>
                <Grid item xs={12} sm={4}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: ad ? ad.content : '<></>',
                    }}
                    className="preview"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <BasicSelect
                    rows={selectData}
                    label={'広告'}
                    name={'ad'}
                    value={data.ad}
                    callback={(value) => {
                      const _f = [...formData];
                      _f[index].ad = value;
                      setFormData(_f);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ChipSelect
                    label={'場所'}
                    name={'place'}
                    chips={arrengeSelectData}
                    defaultValue={data.place}
                    callback={(value) => {
                      const _f = [...formData];
                      _f[index].place = value;
                      setFormData(_f);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={1} sx={{ textAlign: 'center' }}>
                  <Fab
                    color="secondary"
                    aria-label="remove"
                    onClick={() => {
                      const _f = formData.filter((_, i) => i !== index);
                      setFormData(_f);
                    }}
                    size="small"
                  >
                    <RemoveCircleOutlineIcon />
                  </Fab>
                </Grid>
                <Grid item xs={12}>
                  <Fab
                    color="primary"
                    aria-label="add"
                    onClick={() => {
                      const _f = [...formData];
                      _f.splice(index + 1, 0, {
                        id: generateUniqueId(index),
                        ad: '',
                        place: [],
                      });
                      setFormData(_f);
                    }}
                  >
                    <AddIcon />
                  </Fab>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
        <Button onClick={() => setSubmitFormData(formData)} type="submit">
          登録
        </Button>
      </Box>
    </>
  );
}

AdForm.propTypes = {
  setSubmitFormData: PropTypes.func.isRequired,
  defaultData: PropTypes.array,
};
