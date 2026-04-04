export const getTenSecondsAgoFromNow = () => {
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    
    return tenSecondsAgo.toISOString();
}