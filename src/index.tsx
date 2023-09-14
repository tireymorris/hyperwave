import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { Attributes, CustomElementHandler } from "typed-html";

function Layout({ children, title }: Attributes) {
  return (
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Classless example • Pico.css</title>
    <meta
      name="description"
      content="Just a pure semantic HTML markup, without .classes.  Built with Pico CSS."
    />
    <link rel="shortcut icon" href="https://picocss.com/favicon.ico" />
    <link rel="canonical" href="https://picocss.com/examples/classless/" />

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.classless.min.css"
    />
  </head>

  <body>
    <header>
      <hgroup>
        <h1>Classless example</h1>
        <h2>Just a pure semantic HTML markup, without <code>.classes</code></h2>
      </hgroup>
      <nav>
        <ul>
          <li>
            <details role="list">
              <summary aria-haspopup="listbox" role="button">Theme</summary>
              <ul role="listbox">
                <li><a href="#" data-theme-switcher="auto">Auto</a></li>
                <li><a href="#" data-theme-switcher="light">Light</a></li>
                <li><a href="#" data-theme-switcher="dark">Dark</a></li>
              </ul>
            </details>
          </li>
          <li>
            <details role="list">
              <summary aria-haspopup="listbox">Examples (v1)</summary>
              <ul role="listbox">
                <li><a href="../v1-preview/">Preview</a></li>
                <li><a href="../v1-preview-rtl/">Right-to-left</a></li>
                <li><a href="../v1-classless/">Classless</a></li>
                <li><a href="../v1-basic-template/">Basic template</a></li>
                <li><a href="../v1-company/">Company</a></li>
                <li><a href="../v1-google-amp/">Google Amp</a></li>
                <li><a href="../v1-sign-in/">Sign in</a></li>
                <li><a href="../v1-bootstrap-grid/">Bootstrap grid</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="preview">
        <h2>Preview</h2>
        <p>
          Sed ultricies dolor non ante vulputate hendrerit. Vivamus sit amet suscipit sapien. Nulla
          iaculis eros a elit pharetra egestas.
        </p>
        <form>
          <input
            type="text"
            name="firstname"
            placeholder="First name"
            aria-label="First name"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            required
          />
          <fieldset>
            <label for="terms">
              <input type="checkbox" role="switch" id="terms" name="terms" />
              I agree to the <a href="#" onclick="event.preventDefault()">Privacy Policy</a>
            </label>
          </fieldset>
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <section id="typography">
        <h2>Typography</h2>
        <p>
          Aliquam lobortis vitae nibh nec rhoncus. Morbi mattis neque eget efficitur feugiat.
          Vivamus porta nunc a erat mattis, mattis feugiat turpis pretium. Quisque sed tristique
          felis.
        </p>

        <blockquote>
          "Maecenas vehicula metus tellus, vitae congue turpis hendrerit non. Nam at dui sit amet
          ipsum cursus ornare."
          <footer>
            <cite>- Phasellus eget lacinia</cite>
          </footer>
        </blockquote>

        <h3>Lists</h3>
        <ul>
          <li>Aliquam lobortis lacus eu libero ornare facilisis.</li>
          <li>Nam et magna at libero scelerisque egestas.</li>
          <li>Suspendisse id nisl ut leo finibus vehicula quis eu ex.</li>
          <li>Proin ultricies turpis et volutpat vehicula.</li>
        </ul>

        <h3>Inline text elements</h3>
        <figure>
          <table>
            <tbody>
              <tr>
                <td><a href="#" onclick="event.preventDefault()">Link</a></td>
                <td><strong>Bold</strong></td>
                <td><em>Italic</em></td>
              </tr>
              <tr>
                <td><u>Underline</u></td>
                <td><del>Deleted</del></td>
                <td><ins>Inserted</ins></td>
              </tr>
              <tr>
                <td><s>Strikethrough</s></td>
                <td><small>Small </small></td>
                <td><abbr title="Abbreviation" data-tooltip="Abbreviation">Abbr.</abbr></td>
              </tr>
              <tr>
                <td>Text <sub>Sub</sub></td>
                <td>Text <sup>Sup</sup></td>
                <td><kbd>Kbd</kbd></td>
              </tr>
              <tr>
                <td><mark>Highlighted</mark></td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </figure>

        <h3>Heading 3</h3>
        <p>
          Integer bibendum malesuada libero vel eleifend. Fusce iaculis turpis ipsum, at efficitur
          sem scelerisque vel. Aliquam auctor diam ut purus cursus fringilla. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
        </p>
        <h4>Heading 4</h4>
        <p>
          Cras fermentum velit vitae auctor aliquet. Nunc non congue urna, at blandit nibh. Donec ac
          fermentum felis. Vivamus tincidunt arcu ut lacus hendrerit, eget mattis dui finibus.
        </p>
        <h5>Heading 5</h5>
        <p>
          Donec nec egestas nulla. Sed varius placerat felis eu suscipit. Mauris maximus ante in
          consequat luctus. Morbi euismod sagittis efficitur. Aenean non eros orci. Vivamus ut diam
          sem.
        </p>
        <h6>Heading 6</h6>
        <p>
          Ut sed quam non mauris placerat consequat vitae id risus. Vestibulum tincidunt nulla ut
          tortor posuere, vitae malesuada tortor molestie. Sed nec interdum dolor. Vestibulum id
          auctor nisi, a efficitur sem. Aliquam sollicitudin efficitur turpis, sollicitudin
          hendrerit ligula semper id. Nunc risus felis, egestas eu tristique eget, convallis in
          velit.
        </p>

        <figure>
          <img
            src="img/aleksandar-jason-a562ZEFKW8I-unsplash-2000x1000.jpg"
            alt="Minimal landscape"
          />
          <figcaption>
            Image from
            <a href="https://unsplash.com/photos/a562ZEFKW8I" target="_blank">unsplash.com</a>
          </figcaption>
        </figure>
      </section>

      <section id="button">
        <h2>Button</h2>
        <button>Primary</button>
      </section>
     
      <section id="form">
        <form>
          <h2>Form elements</h2>

          <label for="search">Search</label>
          <input type="search" id="search" name="search" placeholder="Search" />

          <label for="text">Text</label>
          <input type="text" id="text" name="text" placeholder="Text" />
          <small>Curabitur consequat lacus at lacus porta finibus.</small>

          <label for="select">Select</label>
          <select id="select" name="select" required>
            <option value="" selected>Select…</option>
            <option>…</option>
          </select>

          <label for="file"
            >File browser
            <input type="file" id="file" name="file" />
          </label>

          <label for="range"
            >Range slider
            <input type="range" min="0" max="100" value="50" id="range" name="range" />
          </label>

          <label for="valid">
            Valid
            <input type="text" id="valid" name="valid" placeholder="Valid" aria-invalid="false" />
          </label>

          <label for="invalid">
            Invalid
            <input
              type="text"
              id="invalid"
              name="invalid"
              placeholder="Invalid"
              aria-invalid="true"
            />
          </label>

          <label for="disabled">
            Disabled
            <input type="text" id="disabled" name="disabled" placeholder="Disabled" disabled />
          </label>

          <label for="date"
            >Date
            <input type="date" id="date" name="date" />
          </label>

          <label for="time"
            >Time
            <input type="time" id="time" name="time" />
          </label>

          <label for="color"
            >Color
            <input type="color" id="color" name="color" value="#0eaaaa" />
          </label>

          <fieldset>
            <legend><strong>Checkboxes</strong></legend>
            <label for="checkbox-1">
              <input type="checkbox" id="checkbox-1" name="checkbox-1" checked />
              Checkbox
            </label>
            <label for="checkbox-2">
              <input type="checkbox" id="checkbox-2" name="checkbox-2" />
              Checkbox
            </label>
          </fieldset>

          <fieldset>
            <legend><strong>Radio buttons</strong></legend>
            <label for="radio-1">
              <input type="radio" id="radio-1" name="radio" value="radio-1" checked />
              Radio button
            </label>
            <label for="radio-2">
              <input type="radio" id="radio-2" name="radio" value="radio-2" />
              Radio button
            </label>
          </fieldset>

          <fieldset>
            <legend><strong>Switches</strong></legend>
            <label for="switch-1">
              <input type="checkbox" id="switch-1" name="switch-1" role="switch" checked />
              Switch
            </label>
            <label for="switch-2">
              <input type="checkbox" id="switch-2" name="switch-2" role="switch" />
              Switch
            </label>
          </fieldset>

          <input type="reset" value="Reset" onclick="event.preventDefault()" />
          <input type="submit" value="Submit" onclick="event.preventDefault()" />
        </form>
      </section>

      <section id="tables">
        <h2>Tables</h2>
        <figure>
          <table role="grid">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
                <th scope="col">Heading</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </figure>
      </section>

      <section id="accordions">
        <h2>Accordions</h2>
        <details>
          <summary>Accordion 1</summary>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque urna diam,
            tincidunt nec porta sed, auctor id velit. Etiam venenatis nisl ut orci consequat, vitae
            tempus quam commodo. Nulla non mauris ipsum. Aliquam eu posuere orci. Nulla convallis
            lectus rutrum quam hendrerit, in facilisis elit sollicitudin. Mauris pulvinar pulvinar
            mi, dictum tristique elit auctor quis. Maecenas ac ipsum ultrices, porta turpis sit
            amet, congue turpis.
          </p>
        </details>
        <details open>
          <summary>Accordion 2</summary>
          <ul>
            <li>Vestibulum id elit quis massa interdum sodales.</li>
            <li>Nunc quis eros vel odio pretium tincidunt nec quis neque.</li>
            <li>Quisque sed eros non eros ornare elementum.</li>
            <li>Cras sed libero aliquet, porta dolor quis, dapibus ipsum.</li>
          </ul>
        </details>
      </section>

      <article id="article">
        <h2>Article</h2>
        <p>
          Nullam dui arcu, malesuada et sodales eu, efficitur vitae dolor. Sed ultricies dolor non
          ante vulputate hendrerit. Vivamus sit amet suscipit sapien. Nulla iaculis eros a elit
          pharetra egestas. Nunc placerat facilisis cursus. Sed vestibulum metus eget dolor pharetra
          rutrum.
        </p>
        <footer><small>Duis nec elit placerat, suscipit nibh quis, finibus neque.</small></footer>
      </article>

      <section id="progress">
        <h2>Progress bar</h2>
        <progress id="progress-1" value="25" max="100"></progress>
        <progress id="progress-2"></progress>
      </section>

      <section id="loading">
        <h2>Loading</h2>
        <article aria-busy="true"></article>
        <button aria-busy="true">Please wait…</button>
      </section>
    </main>

    <footer>
      <small
        >Built with <a href="https://picocss.com">Pico</a> •
        <a href="https://github.com/picocss/examples/blob/master/v1-classless/index.html"
          >Source code</a
        ></small
      >
    </footer>
  </body>
</html>
  );
}

new Elysia()
  .use(html())
  .get("/time", () => <h2>{new Date().toLocaleTimeString()}</h2>)
  .get("/", () => (
    <Layout title="Hello!">
      <sub>I'm here too!</sub>
    </Layout>
  ))
  .listen(process.env.PORT || 4321);
