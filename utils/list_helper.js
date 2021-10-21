const dummy = (blogs) => {
    
    return 1;
};

const totalLikes = (blogs) => {

    const total = blogs.reduce( (sum, currentBlog) => {

        if('likes' in currentBlog)
            return sum + currentBlog.likes;
        else
            return sum;

    }, 0);

    return total;
};

const favoriteBlog = (blogs) => {

    let favorite = blogs[0];

    blogs.forEach(post => {
        
        if('likes' in post)
        {
            if(post.likes > favorite.likes)
                favorite = post;
        }

    });

    return favorite;

};

const mostBlogs = (blogs) => {

    let counter = [];
    let newPerson = true;

    blogs.forEach( post =>{
        newPerson = true;
        
        counter.forEach(entry => {
            if(entry.name === post.author)
            {
                entry.blogCount++;
                newPerson = false;
            }
        });

        if(newPerson)
        {
            counter.push({name:post.author, blogCount:1});
        }
    });

    let winner = counter[0];

    counter.forEach(writer => {
        if(writer.blogCount > winner.blogCount)
        {
            winner = writer;
        }
    });

    return winner;
};

const mostLikes = (blogs) => {

    let parsedBlogs = [];
    let newPerson = true;

    blogs.forEach( post =>{
        newPerson = true;
        
        parsedBlogs.forEach(entry => {
            if(entry.name === post.author)
            {
                entry.likes += post.likes;
                newPerson = false;
            }
        });

        if(newPerson)
        {
            parsedBlogs.push({name:post.author, likes:post.likes});
        }
    });
    
    let winner = parsedBlogs[0];

    parsedBlogs.forEach(writer => {
        if(writer.likes > winner.likes)
        {
            winner = writer;
        }
    });

    return winner;
};

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes};