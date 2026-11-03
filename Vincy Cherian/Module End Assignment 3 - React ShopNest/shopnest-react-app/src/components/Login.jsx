

function Login(){

    return(
        <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="loginModalLabel">LOGIN</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label htmlFor="userName">Username</label> &nbsp;
                        <input type="text" id="userName" autoComplete="username"/><br/><br/>
                        <label htmlFor="userPassword">Password</label> &nbsp;
                        <input type="password" id="userPassword" />
                        <br/><br/>
                        <a id="forgot-pwd" href="">Forgot Password</a>
                        <a id="new_account" href="">Create an Account</a>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Login</button>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login