import { Route, Redirect } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = ChatState();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
