import { Menu, Button, Avatar } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Viewer } from "../../../../lib/types";
import { LOG_OUT } from "../../../../lib/graphql/mutations/Logout";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/Logout/__generated__/LogOut";
import { useMutation } from "@apollo/client";
import { displayErrorMessage, displaySuccessNotification } from "../../../../lib/components";
const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logout] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        displaySuccessNotification("You've successfully logged out!");
      }
    },
    onError: data => {
        displayErrorMessage("Sorry! We werent't able to log you out. Please try again later")
    }
  });

  const handleLogOut = () => [logout()];

  const subMenuLogin = viewer.id ? (
    <SubMenu title={<Avatar src={viewer.avatar} />}>
      <Item key="/user">
        <Link to={`/user/${viewer.id}`}>
          <UserOutlined style={{ margin: "10px" }} />
          Profile
        </Link>
      </Item>
      <Item key="/logout">
        <div onClick={handleLogOut}>
          <LogoutOutlined style={{ margin: "10px" }} />
          Logout
        </div>
      </Item>
    </SubMenu>
  ) : (
    <Item>
      <Link to="/login">
        <Button type="primary">Sign In</Button>
      </Link>
    </Item>
  );
  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined style={{ margin: "10px" }} />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
