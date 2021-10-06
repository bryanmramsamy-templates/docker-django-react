import { gql, useQuery } from "@apollo/client";
import LogoutButton from "./components/authentication/authentication-required/logout-button";


export const TestQueries = () => {
  const { data: dataMe, loading: loadingMe } = useQuery(gql`query{me{id, username}}`)
  const { data: dataUsers, loading: loadingUsers } = useQuery(gql`query{users{edges{node{id, username}}}}`)
  if (loadingMe || loadingUsers) return "...";
  //console.log(dataMe.me);
  //console.log(dataUsers.users.edges);
  return (
    <>
    <div>
      Me: { dataMe.me ? dataMe.me.username : "Unauthenticated" }
      <br />
      Users: { dataUsers.users.edges.map(user => <span key={ user.node.id }>{ user.node.username }{ dataUsers.users.edges.length > 1 ? ", ": "" }</span>) }
      <br />
      <LogoutButton/>
    </div>
    </>
  );
}
