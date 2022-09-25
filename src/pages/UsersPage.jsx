import { useMemo } from 'react'
import Container from 'react-bootstrap/Container'
import SimpleTable from '../components/SimpleTable'
import useUsers from '../hooks/useUsers'
import { Image, Button } from 'react-bootstrap'

const UsersPage = () => {

    const { data } = useUsers()

    console.log(data)

    const makeAdmin = (tableProps) => {
        console.log(tableProps.row.original.id, 'user id')
    }

    const columns = useMemo(() => {
        return [
            {
                Header: 'Photo',
                accessor: 'PlayerImageURL',
                Cell: tableProps => (

                    <Image
                        src={tableProps.row.original.photoURL || 'https://www.salisburyut.com/wp-content/uploads/2020/09/avatar-1-scaled.jpeg'}
                        width={60}
                        roundedCircle
                        alt='Player'
                    />
                )
            },
            {
                Header: 'Userame',
                accessor: 'name'
            },
            {
                Header: 'E-mail',
                accessor: 'email'
            },
            {
                accessor: 'isAdmin',
                Cell: tableProps => (
                    !tableProps.row.original.isAdmin &&
                    < Button onClick={() => { makeAdmin(tableProps) }} > Make Admin </Button>
                )
            }

        ]
    }, [])

    return (
        <Container className="py-3">
            {data && <SimpleTable columns={columns} data={data} />}
        </Container>
    )
}

export default UsersPage