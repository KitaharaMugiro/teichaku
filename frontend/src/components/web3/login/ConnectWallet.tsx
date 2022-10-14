import useMetaMask from "@/hooks/web3/useMetaMask"
import { Button } from "@mantine/core"

export default () => {
    const { login } = useMetaMask()
    return <Button variant="gradient" gradient={{ from: 'blue', to: 'grape' }} onClick={login}>
        Connect Wallet
    </Button>

}