import { Card, Fab, Grid, Icon, lighten, styled, useTheme } from '@mui/material';
import { collection,  getCountFromServer, where, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import {db} from '../../../utils/firebase-config'




const ContentBox = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
}));

const FabIcon = styled(Fab)(() => ({
  width: '44px !important',
  height: '44px !important',
  boxShadow: 'none !important',
}));

const H3 = styled('h3')(({ textcolor }) => ({
  margin: 0,
  color: textcolor,
  fontWeight: '500',
  marginLeft: '12px',
}));

const H1 = styled('h1')(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary,
}));

const Span = styled('span')(({ textcolor }) => ({
  fontSize: '13px',
  color: textcolor,
  marginLeft: '4px',
}));

const IconBox = styled('div')(() => ({
  width: 16,
  height: 16,
  color: '#fff',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '300px ',
  justifyContent: 'center',
  '& .icon': { fontSize: '14px' },
}));

const StatCards2 = () => {
  const { palette } = useTheme();
  const textError = palette.error.main;
  const bgError = lighten(palette.error.main, 0.85);
  const [countManager, setCountManager] = useState(0);
  const [countCertificate, setCountCertificate] = useState(0);

  //count all managers in firebase and set to state
  const getMangers = async () => {
    const coll = collection(db, 'managers');
    const snapshot = await getCountFromServer(coll);
    const countManagers = snapshot.data().count;
    setCountManager(countManagers);
  }
  
  const getCertificates = async () => {
    const coll = collection(db, 'certificates');
    const snapshot = await getCountFromServer(coll);
    const countCertificates = snapshot.data().count;
    setCountCertificate(countCertificates);
  }

  const [inactiveManagers, setInactiveManagers] = useState(0);
  const inActiveManager = async () => {
    const coll = collection(db, "managers");
    const query_ = query(coll, where ("status", "==", "inactive"));
    const snapshot = await getCountFromServer(query_);
    setInactiveManagers(snapshot.data().count);
  }

  useEffect(() => {
    getMangers();    
    getCertificates();
    inActiveManager();
  }, []);


  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: 'rgba(9, 182, 109, 0.15)' }}>
              <Icon sx={{ color: '#08ad6c' }}>trending_up</Icon>
            </FabIcon>
            <H3 textcolor={'#08ad6c'}>Transactions</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{countCertificate}</H1>
            <IconBox sx={{ background: 'rgba(9, 182, 109, 0.15)' }}>
              <Icon className="icon">expand_less</Icon>
            </IconBox>
            
          </ContentBox>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: bgError, overflow: 'hidden' }}>
              <Icon sx={{ color: textError }}>star_outline</Icon>
            </FabIcon>
            <H3 textcolor={textError}>Inactive</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{inactiveManagers}</H1>
            <IconBox sx={{ background: bgError }}>
              <Icon className="icon">expand_less</Icon>
            </IconBox>
            
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
