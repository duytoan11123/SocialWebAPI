// Native fetch is available in Node 18+
const BASE_URL = 'http://localhost:3000/api';

async function test() {
    console.log('--- Testing API with MongoDB ---');

    // 1. Register & Login
    const uniqueSuffix = Date.now();
    const user1 = await registerAndLogin(`user${uniqueSuffix}`, 'pass1', `u${uniqueSuffix}@ex.com`);
    const user2 = await registerAndLogin(`user2${uniqueSuffix}`, 'pass2', `u2${uniqueSuffix}@ex.com`);

    if (!user1 || !user2) return;

    console.log('User 1 ID:', user1.id);

    // 2. Create Post
    console.log('\n--- Post Flow ---');
    // Need to use user.id (which comes from toJSON virtual) or user._id
    const postRes = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: user1.id || user1._id, imageUrl: 'img.png', caption: 'Mongo Post' })
    });
    const post = await postRes.json();
    console.log('Created Post:', postRes.status, post.id);

    // 3. Comments
    console.log('\n--- Comment Flow ---');
    const commentRes = await fetch(`${BASE_URL}/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user2.id, content: 'Nice Mongo post!' })
    });
    console.log('Comment Created:', commentRes.status);

    const commentsListRes = await fetch(`${BASE_URL}/posts/${post.id}/comments`);
    const comments = await commentsListRes.json();
    console.log('Comments List:', comments.length);

    // 4. Likes
    console.log('\n--- Like Flow ---');
    const likeRes = await fetch(`${BASE_URL}/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user2.id })
    });
    console.log('Like Result:', likeRes.status, await likeRes.json());

    // 5. Follows
    console.log('\n--- Follow Flow ---');
    const followRes = await fetch(`${BASE_URL}/users/${user1.id}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: user2.id })
    });
    console.log('Follow Result:', followRes.status, await followRes.json());

    // 6. Profile
    console.log('\n--- Profile Flow ---');
    const profileRes = await fetch(`${BASE_URL}/users/${user1.id}`);
    const profile = await profileRes.json();
    console.log('User1 Profile Followers:', profile.followersCount);
}

async function registerAndLogin(username, password, email) {
    await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    });

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const user = await res.json();
    if (user.id || user._id) return user;
    console.error('Login failed', user);
    return null;
}

test().catch(console.error);
