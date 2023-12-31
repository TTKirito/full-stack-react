import { Input, Layout } from "antd";
import { useEffect, useState } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils.ts";
import { MenuItems } from "./components";

const { Header } = Layout;
const { Search } = Input;
const logo = 'https://res.cloudinary.com/tttkirito/image/upload/v1702542400/APP_booking/jh53minmpipctd6gtldm.png'

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = withRouter(
  ({ viewer, setViewer, history, location }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
      const { pathname } = location;
      const pathnameSubStrings = pathname.split("/");

      if (!pathname.includes("/listings")) {
        setSearch("");
        return;
      }

      if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
        setSearch(pathnameSubStrings[2]);
        return;
      }
    }, [location]);

    const onSearch = (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please enter a valid search!");
      }
    };
    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              placeholder="Search 'Hue'"
              enterButton
              onSearch={onSearch}
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
            />
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
