import Link from 'next/link';

const Other = () => (
    <div>
        {/* Different way to link */}
        <Link href='/about'>
            <a>About page</a>
        </Link>
        <br></br>
        <a href='/'>Index page</a>
        
        <p>This is another page</p>
    </div>
);

export default Other;
