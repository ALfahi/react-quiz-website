/* this component is used to show a pop up telling user that they are about to be logged out, they then can either ignore the pop up
or renew their login session */
import { useLoginWarning } from "../javascript/pages/LoginWarning"
import "../css/LoginWarning.css"
export function LoginWarning()
{
    const {message,countdown, dialogRef, renewLogin, closeLoginWarning} = useLoginWarning();

    return (
        <dialog className = 'loginWarning' ref={dialogRef} aria-labelledby="logout-warning-title" aria-describedby="logout-warning-desc">
          <div className="text">
            <h2 id="warningTitle">Your session is about to expire!</h2>
            {message ? (
              <p className = "warningDescription">{message}</p>
            ) : (
              <p className="warningDescription">
                You will be logged out in <strong>{countdown}</strong> seconds.
                Click below to stay logged in or close to ignore.
              </p>
            )}
          </div>
          <div className="popUpButtons">
            {!message && <button onClick={renewLogin}>Stay Logged In</button>}
            <button onClick={closeLoginWarning}>Close</button>
          </div>
        </dialog>
      );
}

export default LoginWarning