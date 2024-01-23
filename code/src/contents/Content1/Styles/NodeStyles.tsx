import { Paper, styled } from "@mui/material";

export const ReactionNodeStyle = styled(Paper)(({ theme }) => ({
  width:theme.spacing(8),
  height:theme.spacing(4),
  lineHeight: theme.spacing(4),
  textAlign:"center",
  backgroundColor:theme.palette.warning.light
}));


export const MaterialNodeStyle = styled(Paper)(({ theme }) => ({
  width:theme.spacing(8),
  height:theme.spacing(4),
  lineHeight: theme.spacing(4),
  textAlign:"center",
  backgroundColor:theme.palette.success.light
}));
