import Base from "../layout/Base";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <>
      <Base>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe ipsa
        debitis velit, eaque placeat consectetur veniam ab odio? Vel quod earum
        eaque ad repellat a mollitia, recusandae et voluptatem. Odit.
      </Base>
    </>
  );
};

export default Profile;
