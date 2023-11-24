import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail} from 'firebase/auth'
import './SignUp.css'
import { db, firebase } from '../Firebase/firebase'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUnSub, setUserDetail } from '../Redux-Toolkit/BazarSlice';
import { off, onValue, ref } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs';
import imageSrc from '../photos/campus_image.png'
import blueImgSrc from '../photos/campus_image_blue.png'
import * as Yup from 'yup'
import { TailSpin } from 'react-loader-spinner';
// import { toast } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '../assets/screenAssets/input/Input';
import AuthLeftSide from './AuthLeftSide';
// import { Toast } from 'react-toastify/dist/components';


const SignIn = () => {
    const {userDetail, unSub} = useSelector(e => e)
    const [passType, setPassType] = useState('password')
    const auth = getAuth();
    const [reqCheck, setReqCheck] = useState(false)
    const [err, setErr] = useState(false)
    const [ passBorder, setPassBorder ] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [ inputClick, setInputClick ] = useState(false)
    let check = false
    const notify = (error) => toast(error);
    let unsubscribe = ''
    // const [ check, setCheck ] = useState(false)
    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      });
    useEffect(() => {
        if(userDetail && ( userDetail != 'loading' || userDetail != 'loading2' && userDetail.verify ))
        navigate('/')
        else navigate('/logIn')
    },[userDetail])
    const navigate = useNavigate()
    const dispatch = useDispatch()
        const formik = useFormik({
            initialValues:{
            email: "",
            password: ""
        },
        // validationSchema: validationSchema,
        onSubmit: (values) => {
            LogIn()
        }
        })
    const LogIn = (e) => {
        if(!check2){
            check = true
            // alert('yes')
            setCheck2(true)
        }
            // setCheck(true)
            setTimeout(() => {
            if(check){
            let temp = {...reqCheck}
            if(formik.values.email == "") {
                temp.email = true;
                setErr(false)
                setReqCheck(temp)
                check = false
                setCheck2(false)
            }
        if(formik.values.password == "") {
            temp.password = true;
            setErr(false)
            setReqCheck(temp)
            check = false
            setCheck2(false)
        }
        
        else if(!temp.email && !temp.password)
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password).then((data) => {
            // onAuthStateChanged(auth, (user) => {
                const user = data?.user
                if(user){
                    // const uid = user.uid
                    // console.log(user?.uid, " Dataiwoej")
                    unsubscribe = onValue(ref(db, "users/" + user?.uid + "/userDetail"), (data) => {
                        // if(window.location.pathname == '/' && data.val()?.block == true)
                        // window.location.pathname = '/'
                        if(data.val()?.status == 'Admin'){
                        dispatch(setUserDetail('loading'))
                        setTimeout(() => {
                            dispatch(setUserDetail(data.val()))
                        },1500)
                        setCheck2(true)
                    }
                    // alert('test')
                    else if(data.val()) 
                    if(data.val()?.block == true && data.val()?.verify && data.val()?.status != 'Admin'){
                        notify('You are blocked by the admin')
                        // alert("You are blocked by the admin")
                        // <button onClick={() => notify()}>Notify!</button>
                        // <ToastContainer /> 
                        check = false
                        setCheck2(false)
                        // if(!unSub)
                        unsubscribe()
                        // off(unsubscribe)
                        dispatch(setUnSub(true))
                        signOut(auth)
                        // window.location.pathname = '/'
                        .then(() =>
                        // setTimeout(() => {
                            dispatch(setUserDetail(false))
                            // }, 2000)}
                            ).catch(() => 
                            dispatch(setUserDetail(false))
                        )
                        setCheck2(false)
                        }
                        else if( data.val() && data.val()?.verify != true){
                            notify("You are not verified please contact with the admin") 
                            check = false
                            setCheck2(false)
                            // if(!unSub)
                            unsubscribe()
                            // off(unsubscribe)
                            dispatch(setUnSub(true))
                            signOut(auth)
                            // window.location.pathname = '/'
                            .then(() =>
                            // setTimeout(() => {
                                dispatch(setUserDetail(false))
                                // },2000)
                                ).catch(() => 
                                dispatch(setUserDetail(false))
                            )
                            setCheck2(false)
                        }
                        else{
                            // dispatch(setUserDetail('loading'))
                            setTimeout(() => {
                                dispatch(setUserDetail(data.val()))
                            },1500)
                            setCheck2(true)

                        }
                        })


                        // dispatch(setUserDetail(data.val())) : 
                        // dispatch(setUserDetail(false))
                    setTimeout(() => {

                        if(userDetail != false){
                            formik.values.email = ""
                            formik.values.password = ""
                            // alert('You are blocked or not verified Please contact with the admin4')
                        }
                    },300)
                    // check = false
                    // setCheck2(false)
                        // setCheck(false)
            }
            // })
            // navigate('/')
        }).catch((err) => { 
        setErr(err)
        setCheck2(false)
        })
        // else setCheck2(false)
    }
    // else setCheck2(false)
    },1000)
    }
    return(
        <div className="signUpMainDiv">
            <form onSubmit={(e)=>formik.handleSubmit(e)} className="signUpForm">
                <img className='signUpHideImage' width={'60px'} height={'60px'} src={blueImgSrc} />                
                <div className='signUpDiv signInDiv'>
                <h1 style={{ width: '100%', textAlign: 'start', padding: '0 5px'}}>LOGIN</h1>
                <Input name={'Email'} inputClass={'signUpTextInput'} si={true} formik={formik} reqCheck={reqCheck} setReqCheck={setReqCheck} setErr={setErr}/>
                <Input type='pass' passBorder={passBorder} setPassBorder={setPassBorder} err={err ? <p className='signUpError'>Invalid Email or Password</p> : false} passType={passType} setPassType={setPassType} name={'Password'} inputClass={`signUpTextInput signUpPassInput`} si={true} formik={formik} reqCheck={reqCheck} setReqCheck={setReqCheck} setErr={setErr}/>
                <p onClick={() => navigate('/forget-password')} style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '15px', marginBottom: '-20px'}}><Link>Forgot Password</Link></p>
                <button disabled={formik.values.email == '' || formik.values.password == ''} 
                className={check2 || formik.values.email == '' || formik.values.password == '' ?
                'signUpButton signUpBgGray':'signUpButton' } type='submit'>
                    {!check2 ? "Log In" :
                <TailSpin height="20" width="20" color="#4fa94d" ariaLabel="tail-spin-loading" 
                radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                }
                </button>
                <p>Don't have an account <Link to={'/signUp'}>Create One</Link></p>
                </div>
                <AuthLeftSide />
            </form>
            <div style={{width: 'fitContent'}}>
                <ToastContainer />
            </div>
        </div>
    )
}
export default SignIn