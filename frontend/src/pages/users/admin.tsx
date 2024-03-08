import Users from '.'

type Props = {}

const Admin = (props: Props) => {
  return (
    <Users role={'admin'} />
  )
}

export default Admin