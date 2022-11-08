import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import AllCertTable from "./AllCertTable";
import ListManager from "./ListManager";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppTable = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "List Manager" }]} />
      </Box>

      {/* <SimpleCard title="Simple Table">
        <SimpleTable />
      </SimpleCard> */}

      <SimpleCard title="List Manager">
        <ListManager />
      </SimpleCard>
    </Container>
  );
};

export default AppTable;
