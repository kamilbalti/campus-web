import imageSrc from '../photos/campus_image.png'
const AuthLeftSide = () => {
    return (
        <div className='bgBlueLock signUpImage'>
            <img width={'150px'} height={'150px'} src={imageSrc} />
            <h1><i>CAMPUS APP</i></h1>
            <h3 style={{ textAlign: 'center', fontSize: '20px' }}>Apply For Job Or <br /> Hire A Verified Person Efficiently</h3>
        </div>
    )
}
export default AuthLeftSide