import { Grid } from "@mui/material";
import { MathJaxContext, MathJax } from "better-react-mathjax";

type MathExpressionViewerProps={
  keyTranslationSet:{[key:string]:string}|null,
  reactionRateExpression:{[key:string]:string}|null
}

const MathExpressionViewer=(props:MathExpressionViewerProps)=>{

  const handleTranslation=(s:string, rereading:{[k:string]:string})=>{

    const escapeRegExp=(str:string)=>{
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    let text = s;
    if (rereading !== null) {
      Object.keys(rereading).forEach((k) => {
        const regex = new RegExp(escapeRegExp(k), 'g');
        text = text.replace(regex, rereading[k]);
      });
    }
    return text.replace(/^\+/g, '').replace(/\*/g, '');
  }

  return (
    <Grid container sx={{p:1,display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
      <Grid item xs={12}>
        <MathJaxContext>
          {props.reactionRateExpression!==null &&
          Object.keys(props.reactionRateExpression)
              .map((key)=>(
              <MathJax key={key} style={{fontSize:18,padding:"5px"}}>
                  {(props.reactionRateExpression!==null && props.keyTranslationSet!==null) &&
                  ("\\(\\frac{d"+props.keyTranslationSet[key]+"}{dt} = "+handleTranslation(props.reactionRateExpression[key]+"\\)",props.keyTranslationSet))}
              </MathJax>
              ))
          }
        </MathJaxContext>
      </Grid>
    </Grid>
  );
}

export default MathExpressionViewer;
