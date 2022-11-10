import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { loginAction, getUser } from "../../redux/actions/app.actions";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { postLogin } from "../../redux/actions/app.actions";
import PerfilUser from "../PerfilUser/PerfilUser";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DocumentTitle from "react-document-title";

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const role = useSelector((state) => state.app.token.role);

  const [userLog, setUserLog] = React.useState({
    email: " ",
    password: " ",
  });

  const handleChange = (e) => {
    setUserLog({ ...userLog, [e.target.name]: e.target.value });
  };

  const auth = getAuth();
  const user = auth.currentUser;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("el usuario esta logueado");
      //  history.push(`/juira/home`);

      /* 
            PROPERTIES USER CREADO CON MAIL:

            accessToken
: 
"eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmNjcyNDYxOTk4YjJiMzMyYWQ4MTY0ZTFiM2JlN2VkYTY4NDZiMzciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vanVpcmFhdXRoIiwiYXVkIjoianVpcmFhdXRoIiwiYXV0aF90aW1lIjoxNjY3MDkxMTE4LCJ1c2VyX2lkIjoicno5cEZMcnlMR2hRbGp3cGpUVzVTaXdsM1RwMiIsInN1YiI6InJ6OXBGTHJ5TEdoUWxqd3BqVFc1U2l3bDNUcDIiLCJpYXQiOjE2NjcwOTExMTgsImV4cCI6MTY2NzA5NDcxOCwiZW1haWwiOiJtYXJpYW5wcnVlYmExQHlhaG9vLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJtYXJpYW5wcnVlYmExQHlhaG9vLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.WotcrxxYkdb2opRCLxvIfA8SD3FhTWQeZKiwOo81V7vumtfGIRt2NgxGfUa5liHOA1Bo9SzIMOlJbcfpgTV0EpLXoxnpm_qnJvXLLcSGD7IVqNFH-uUtGn48bMPmtTcQK9Csh_nfX764qRTmqaX4HQOCZAd88HCLAbb8TAoLPWv8ANc0zDNezGKY2PsavrWUf1gwJrxaYhZS06ldPoICER_f-rFSMTjykWNm52sYPJT7ee0O8LogYp0oJUzWQL0d_hlLbjen7gZ0B3g3o5-kSt3xafHqf9oT-E_4yNG2aZHM_Krg7Hc_L6Qm_EFg229MAuiVZryBABtweoCR_Ruo3w"
auth: e {app: e, heartbeatServiceProvider: e, config: {…}, currentUser: e, emulatorConfig: null, …}
displayName: null
email: "marianprueba1@yahoo.com"
emailVerified: false
isAnonymous: false
metadata: e {createdAt: '1667091118757', lastLoginAt: '1667091118757', lastSignInTime: 'Sun, 30 Oct 2022 00:51:58 GMT', creationTime: 'Sun, 30 Oct 2022 00:51:58 GMT'}
phoneNumber: null
photoURL:null
proactiveRefresh:e {user: e, isRunning: false, timerId: null, errorBackoff: 30000}
providerData: [{…}]
providerId: "firebase"
reloadListener: null
reloadUserInfo: {localId: 'rz9pFLryLGhQljwpjTW5Siwl3Tp2', email: 'marianprueba1@yahoo.com', passwordHash: 'UkVEQUNURUQ=', emailVerified: false, passwordUpdatedAt: 1667091118757, …}
stsTokenManager: e {refreshToken: 'AOEOulYQC99CO7v652oFzlthC4UW17y1ksC1NPjkKiE17R9f9_…bLSHH1cJ8YMujljWYJMW-XKpwlSwFm5Z6a_mLIdlTHkPbrfB3', accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmNjcyNDYxOTk4YjJiMz…NG2aZHM_Krg7Hc_L6Qm_EFg229MAuiVZryBABtweoCR_Ruo3w', expirationTime: 1667094719496}
tenantId:null
uid: "rz9pFLryLGhQljwpjTW5Siwl3Tp2"
            */
    } else {
      console.log("el usuario esta deslogueado");
    }
  });

  const login = async () => {
    if (userLog.email !== "" && userLog.password !== "") {
      try {
        const signIn = await signInWithEmailAndPassword(
          auth,
          userLog.email,
          userLog.password
        ).then((res) => {
          return res.user.accessToken;
        });

        console.log("se inicio sesion con email");
        await dispatch(loginAction({ token: signIn }));
        await dispatch(getUser());
        history.push(`/juira/login`);
      } catch (error) {
        toast.error("Contraseña o Email incorrectos");
        console.log(`Error ${error.code}: ${error.message}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    const tokenGoogle = await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // The signed-in user info.
        const user = result.user;
        // ...
        const token = user.getIdToken();

        console.log(token);
        return token;
      })
      .catch((error) => console.log(`Error ${error.code}: ${error.message}`));

    console.log("se inicio sesion con google");

    await dispatch(loginAction({ token: tokenGoogle }));
    await dispatch(getUser());
    history.push(`/juira/login`);
  };

  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 350,
    margin: "20px auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnstyle = { margin: "8px 0" };
  const txtstyle = {
    margin: "10px 0",
    fontFamily: "nunito",
    color: "var(--primaryColor)",
  };
  return (
    <div>
      <DocumentTitle title="LOGUEO"></DocumentTitle>
      {role && (
        <div>
          <PerfilUser />
        </div>
      )}
      {!role && (
        <Grid>
          <Paper elevation={10} style={paperStyle}>
            <Grid align="center" style={{ marginBottom: "20px" }}>
              <Avatar style={avatarStyle}>
                <LockIcon />
              </Avatar>
              <h2>Iniciar Sesión</h2>
            </Grid>
            {/* <TextField label='Nombre y Apellido' placeholder='Nombre y Apellido' style={txtstyle} fullWidth required/> */}
            {/* <TextField label='Mail' placeholder='Mail' style={txtstyle} fullWidth required/> */}
            <TextField
              label="Usuario"
              name="email"
              placeholder="Usuario"
              onChange={handleChange}
              style={txtstyle}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              style={txtstyle}
              type="password"
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  style={{ color: "var(--primaryColor)" }}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Recuérdame"
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btnstyle}
              fullWidth
              sx={{
                backgroundColor: "#23c197",
                "&:hover": { backgroundColor: "#138f6e" },
              }}
              onClick={login}
            >
              Iniciar Sesión
            </Button>
            {/* <Typography >


                     <Link to="#" >
                        Olvidaste tu contraseña?
                </Link>
                </Typography> */}

            <Button onClick={handleGoogleSignIn}>Login con Google</Button>
            <Typography>
              {" "}
              Todavía no estás registrado?
              <Link to="/juira/register">Regístrate</Link>
            </Typography>
          </Paper>
        </Grid>
      )}
    </div>
  );
}
