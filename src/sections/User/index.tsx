import { useQuery } from "@apollo/client";
import { Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import { RouteComponentProps } from "react-router-dom";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { Viewer } from "../../lib/types";
import { UserProfile } from "./components/UserProfile";

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

export const User = ({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
    },
  });

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error" />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === match.params.id;

  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;
  return (
    <Content>
      <Row gutter={12} justify="space-between" style={{ marginTop: "60px" }}>
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
