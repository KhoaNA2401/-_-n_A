import { Box, Card, Grid, Icon, IconButton, styled, Tooltip } from '@mui/material';
import { Small } from 'app/components/Typography';
import { collection, getDocs, query, updateDoc, doc, where, getCountFromServer } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../../../utils/firebase-config'


const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

const StatCards = () => {
  const [countManager, setCountManager] = useState(0);
  const [countCertificate, setCountCertificate] = useState(0);
  const [activeManager, setActiveManager] = useState(0);

  const cardList = [
    { name: 'Active Manager', amount:`${activeManager}`, icon: 'check_box' },
    { name: 'Total Manager', amount: `${countManager}`, icon: 'group' },
    { name: 'Total Avaiable Certificate', amount: `${countCertificate}`, icon: 'credit_card' },
    { name: 'Total Assess', amount: '305 ', icon: 'thumb_up' },
  ];

  const getMangers = async () => {
    const coll = collection(db, 'managers');
    const snapshot = await getCountFromServer(coll);
    const countManagers = snapshot.data().count;
    setCountManager(countManagers);
  }

  const getManagerActive = async () => {
    const coll = collection(db, "managers");
    const query_ = query(coll, where ("status", "==", "Active"));
    const snapshot = await getCountFromServer(query_);
    setActiveManager(snapshot.data().count);
  }
  const getCertificates = async () => {
    const coll = collection(db, 'certificates');
    const snapshot = await getCountFromServer(coll);
    const countCertificates = snapshot.data().count;
    setCountCertificate(countCertificates);
  }

  useEffect(() => {
    getManagerActive();
    getMangers();
    getCertificates();
  }, []);

  return (
    // <></>
    <Grid container spacing={3} sx={{ mb: '24px' }}>
      {cardList.map((item, index) => (
        <Grid item xs={12} md={6} key={index}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="12px">
                <Small>{item.name}</Small>
                <Heading>{item.amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
    // <h1>hello</h1>
  );
};

export default StatCards;
