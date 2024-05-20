<h1>React Redux Hero admin panel</h1>
<p>Hero admin panel with functions show, add, delete and filter list of heroes in DB (REST API).</p>
<p><a href="https://systemshock89.github.io/react-redux-hero-admin-panel/">Demo</a></p>

<h2>Used technologies</h2>
<ul>
    <li>React<br> 
    hooks: <code>useState</code>, <code>useEffect</code>, <code>useCallback</code><br>
    custom react hook: <code>useHttp</code>
    </li>
    <li>React-redux (with <code>useDispatch</code>, <code>useSelector</code>, RTK Query <code>createApi, fetchBaseQuery</code>)</li>
    <li>Redux-toolkit (with <code>createReducer</code>, <code>configureStore</code>, <code>nanoid</code>)
    <li><b>Pattern when action creators and reducers combined in slice</b> (with <code>createSlice</code>, <code>createAsyncThunk</code>, <code>createEntityAdapter</code>)</li>
    </li>
    <li>react-transition-group for transition effects on elements</li>
    <li>Create React App</li>
    <li>json-server (in GitHub Pages works with service <a href="https://my-json-server.typicode.com/" >https://my-json-server.typicode.com/</a>)</li>
</ul>

<h2>How to use</h2>
<ol>
    <li><b>Need Node.js 16 or later</b></li>
    <li><code>git clone</code></li>
    <li><code>npm i</code></li>
    <li><code>npm start</code></li>
</ol>

<h2>How to deploy (to GitHub Pages)</h2>
<ol>
    <li><code>npm run deploy</code></li>
</ol>