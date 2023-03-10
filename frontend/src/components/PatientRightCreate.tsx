import React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";
import { AlertTitle } from "@material-ui/lab";
import { EmployeeInterface } from "../models/IEmployee";
import { HospitalInterface } from "../models/IHospital";
import { PatientInterface } from "../models/IPatient";
import { RightTypeInterface } from "../models/IRighttype";
import { PatientRightInterface } from "../models/IPatientRight";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    text: {
      color: "#000000",
      fontSize: "1rem",
    },
  })
);

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

function CreatePatientRight() {
  const params = useParams();
  const classes = useStyles();
  const [SendingTime, setSendingTime] = React.useState<Date | null>(new Date());
  const [hospital, setHospital] = useState<HospitalInterface[]>([]);
  const [patients, setPatients] = useState<PatientInterface[]>([]);
  const [righttype, setRightType] = useState<RightTypeInterface[]>([]);
  const [patientright, setPatientRight] = useState<
    Partial<PatientRightInterface>
  >({});
  const [nurse, setNurse] = useState<EmployeeInterface>();
  const [errorMessage, setErrorMessage] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof patientright;
    setPatientRight({
      ...patientright,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSendingTime(date);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof patientright;

    const { value } = event.target;

    setPatientRight({ ...patientright, [id]: value });
  };

  //Get Data
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getHospital = async () => {
    fetch(`${apiUrl}/hospitals`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setHospital(res.data);
        } else {
          return false;
        }
      });
  };
  //console.log()
  const getRightType = async () => {
    fetch(`${apiUrl}/righttypes`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setRightType(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPatient = async () => {
    fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.data) {
          setPatients(res.data);
        } else {
          console.log("else");
        }
      });
  };
  console.log("Patient", nurse);

  const getNurse = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/employee/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setNurse(res.data);
        } else {
          console.log("else");
        }
      });
  };
  console.log("Nurse", nurse);

  const getPatientRightById = async (id: string) => {
    fetch(`${apiUrl}/patientright/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setPatientRight({
            PatientID: res.data.PatientID,
            ID: res.data.ID,
            Name: res.data.Name,
            RightTypeID: res.data.RightTypeID,
            HospitalID: res.data.HospitalID,
            EmployeeID: res.data.EmployeeID,
            Discount: res.data.Discount,
            Note: res.data.Note,
          });
        } else {
          console.log("error");
        }
      });
  };

  useEffect(() => {
    if (params.id) {
      getPatientRightById(params.id);
    }

    getRightType();
    getPatient();
    getNurse();
    getHospital();
    getRightType();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    if (patientright.PatientID == 0) {
      setError(true);
      setErrorMessage("?????????????????????????????????????????????");
    } else if (patientright.RightTypeID == 0) {
      setError(true);
      setErrorMessage("???????????????????????????????????????????????????????????????????????????");
    } else if (patientright.HospitalID == 0) {
      setError(true);
      setErrorMessage("??????????????????????????????????????????????????????????????????????????????????????????");
    } else {
      setError(false);
      let data = {
        PatientID: convertType(patientright.PatientID),
        EmployeeID: convertType(nurse?.ID),
        RightTypeID: convertType(patientright.RightTypeID),
        HospitalID: convertType(patientright.HospitalID),
        DateRocrcord: SendingTime,
        Note: patientright.Note ?? "",
      };
      console.log(data);
      
      if (params.id) {
        const requestOptionsPost = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        fetch(`${apiUrl}/patientrights/${params.id}`, requestOptionsPost)
          .then((response) => response.json())
          .then((res) => {
            if (res.data) {
              setSuccess(true);
              setErrorMessage("");
              // ClearForm();
            } else {
              console.log("??????????????????????????????????????????????????????");
              setError(true);
              if (res.error.includes("Note cannot be blank")) {
                setErrorMessage("????????????????????????????????????????????????????????????????????????????????????");
              } else if (res.error.includes("Time must be Now")) {
                setErrorMessage("???????????????????????????????????????????????????????????????????????????????????????");
              } else {
                setErrorMessage(res.error);
              }
            }
          });
      } else {
        const requestOptionsPost = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        fetch(`${apiUrl}/patientrights`, requestOptionsPost)
          .then((response) => response.json())
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              setSuccess(true);
              setErrorMessage("");
              ClearForm();
            } else {
              console.log("??????????????????????????????????????????????????????");
              setError(true);
              if (res.error.includes("Note cannot be blank")) {
                setErrorMessage("????????????????????????????????????????????????????????????????????????????????????");
              } else if (res.error.includes("Time must be Now")) {
                setErrorMessage("???????????????????????????????????????????????????????????????????????????????????????");
              } else {
                setErrorMessage(res.error);
              }
            }
          });
      }
    }
  }

  // function clear form after submit success
  const ClearForm = () => {
    setPatientRight({
      Note: "",
      HospitalID: 0,
      PatientID: 0,
      RightTypeID: 0,
      EmployeeID: 0,
    });
    setSendingTime(new Date());
  };

  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          ??????????????????????????????????????????????????????
        </Alert>
      </Snackbar>

      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          <AlertTitle>Error</AlertTitle>
          ?????????????????????????????????????????????????????? : {errorMessage}
        </Alert>
      </Snackbar>

      <Paper className={classes.paper}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          ??????????????????????????????????????????????????????????????????????????????
        </Typography>

        <Divider />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{ color: "#006A7D", fontSize: "10" }}>???????????????</p>
              <Select
                native
                value={patientright.PatientID}
                onChange={handleChange}
                inputProps={{
                  name: "PatientID",
                }}
                disabled={params.id ? true : false}
              >
                <option aria-label="None" value="">
                  ?????????????????????????????????????????????
                </option>
                {patients.map((item: PatientInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.FirstName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{ color: "#006A7D", fontSize: "10" }}>
                ??????????????????????????????????????????????????????????????????????????????
              </p>
              <Select
                native
                value={patientright.RightTypeID}
                onChange={handleChange}
                inputProps={{
                  name: "RightTypeID",
                }}
              >
                <option aria-label="None" value="">
                  ?????????????????????????????????????????????????????????????????????????????????????????????
                </option>
                {righttype.map((item: RightTypeInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Typename}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{ color: "#006A7D", fontSize: "10" }}>
                ???????????????????????????????????????????????????????????????????????????
              </p>
              <Select
                native
                value={patientright.HospitalID}
                onChange={handleChange}
                inputProps={{
                  name: "HospitalID",
                }}
              >
                <option aria-label="None" value="">
                  ??????????????????????????????????????????????????????????????????????????????????????????
                </option>
                {hospital.map((item: HospitalInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{ color: "#006A7D", fontSize: "10" }}>
                ?????????????????????????????????????????????????????????????????????????????????
              </p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="SendingTime"
                  value={SendingTime}
                  onChange={handleDateChange}
                  label="?????????????????????????????????????????????????????????????????????"
                  minDate={new Date("2018-01-01T00:00")}
                  format="dd/MM/yyyy"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{ color: "#006A7D", fontSize: "10" }}>???????????????????????? :</p>
              <TextField
                id="Note"
                variant="outlined"
                type="string"
                size="medium"
                value={patientright.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p style={{ color: "#006A7D", fontSize: "10" }}>?????????????????????????????????</p>
              <Select
                native
                value={patientright.EmployeeID}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "EmployeeID",
                }}
              >
                <option value={nurse?.ID} key={nurse?.ID}>
                  {nurse?.Name}
                </option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <p></p>
          </Grid>
        </Grid>
      </Paper>
      <br />
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={3}>
          <Button
            style={{ float: "right" }}
            variant="contained"
            onClick={submit}
            color="primary"
          >
            {params?.id ? "??????????????????" : "??????????????????"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
export default CreatePatientRight;
