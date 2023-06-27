import { useState } from "react";
import Web3 from "web3";
import arbitrator from "../contracts/Arbitrator.sol/Arbitrator.json";
import axios from "axios";

export default function Jobs() {
  const [jobs, setJobs] = useState([
    { id: 0, title: "Job 1", description: "Job 1 description" },
    { id: 1, title: "Job 2", description: "Job 2 description" },
    { id: 2, title: "Job 3", description: "Job 3 description" },
  ]);

  const web3 = new Web3((window as any).ethereum);

  // Prompt user to connect Metamask to your app
  (window as any).ethereum.enable();

  // Set the contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Set the contract instance
  const contractInstance = new web3.eth.Contract(
    arbitrator.abi as any,
    contractAddress
  );
  console.log(arbitrator);
  console.log(web3.utils.toWei("1.0", "ether"));
  console.log(Number(web3.utils.toWei("1.0", "ether")));

  const handlePayment = async (id: number) => {
    const accounts = await web3.eth.getAccounts();
    const job = jobs[0]; // Get the first job
    console.log(web3.utils.toWei("1.0", "ether"));
    console.log(Number(web3.utils.toWei("1.0", "ether")));
    // Call the smart contract method to make payment
    contractInstance.methods
      .createJobContract(id, web3.utils.toWei("1", "ether"))
      .send({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"), // Amount to pay in ether
      })
      .then((result: any) => {
        // Payment successful, redirect to the job link
        // window.location.href = job.link;
        console.log(result);
      })
      .catch((error: any) => {
        // Payment failed, show error message
        console.error("Error: ", error);
      });
  };

  const rejectJob = async () => {
    const job = jobs[0];
    const accounts = await web3.eth.getAccounts();

    contractInstance.methods
      .rejectJobContract(job.id)
      .send({ from: accounts[0] })
      .then((result: any) => {
        console.log(result);
      })
      .catch((error: any) => {
        console.error("Error: ", error);
      });
  };

  const checkContractBalance = async () => {
    const balance = await contractInstance.methods
      .getArbitratorBalance()
      .call();
    console.log(balance);
  };

  const checkClientAddress = async () => {
    const clientAddress = await contractInstance.methods
      .getClientAddress(jobs[0].id)
      .call();
    console.log(clientAddress);
  };

  const checkFreelancerAddress = async () => {
    const freelancerAddress = await contractInstance.methods
      .getFreelancerAddress(jobs[0].id)
      .call();
    console.log(freelancerAddress);
  };

  const acceptJob = async (id: number) => {
    const accounts = await web3.eth.getAccounts();

    contractInstance.methods
      .acceptJobContract(id)
      .send({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"), // Amount to pay in ether
      })
      .then((result: any) => {
        // Payment successful, redirect to the job link
        // window.location.href = job.link;
        console.log(result);
      })
      .catch((error: any) => {
        // Payment failed, show error message
        console.error("Error: ", error);
      });
  };

  const checkEscrowStatus = async () => {
    contractInstance.methods
      .getEscrowContractState(0)
      .call()
      .then((result: any) => console.log(result));
  };

  const releseFunds = async () => {
    axios
      .post("http://localhost:5111/arbitrator/release-funds", "Hello World!")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const releseEscrow = async () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );

    // Set up the transaction parameters
    const trustedAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const privateKey =
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const transactionObject = {
      from: trustedAccount,
      to: contractAddress,
      gas: 2000000,
      data: contractInstance.methods.releaseEscrow(0).encodeABI(),
    };

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(
      transactionObject,
      privateKey
    );
    if (signedTx.rawTransaction) {
      const txReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(`Transaction hash: ${txReceipt.transactionHash}`);
    }
  };
  const getArbitratorAddress = () => {
    contractInstance.methods
      .getArbitratorAddress()
      .call()
      .then((result: any) => console.log(result));
  };

  const verifyCode = async () => {
    axios
      .post("http://localhost:5111/verification/verify", {
        description:
          "The website should have a homepage that includes a navigation bar with links to different pages on the site. The homepage should also include a hero section with a large image and a call-to-action button. Below the hero section, there should be a section that displays the latest blog posts from the site's blog, with images, titles, and short descriptions for each post. The site should have a blog page that displays all the blog posts, sorted by date with the newest posts at the top. Each post should include a title, an author name, the post date, and the full text of the post. The blog page should also include a search bar that allows users to search for posts by keyword.The site should have an about page that includes information about the site's mission and history, as well as bios and photos of the site's founders. Finally, the site should have a contact page that includes a contact form with fields for name, email, and message, as well as a submit button. The design of the site should be clean and modern, with a consistent color scheme and typography throughout. The site should be fully responsive and optimized for mobile and desktop viewing.",
        code: `<!DOCTYPE html>
          <html>
            <head>
              <title>My Website</title>
              <link rel="stylesheet" type="text/css" href="style.css">
            </head>
            <body>
              <nav>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/blog">Blog</a></li>
                  <li><a href="/about">About</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </nav>
              <header>
                <div class="hero">
                  <img src="hero.jpg" alt="Hero Image">
                  <button>Learn More</button>
                </div>
              </header>
              <main>
                <section>
                  <h2>Latest Blog Posts</h2>
                  <div class="posts">
                    <div class="post">
                      <img src="post1.jpg" alt="Post 1 Image">
                      <h3><a href="/blog/post1">Post 1 Title</a></h3>
                      <p>Short description of Post 1...</p>
                    </div>
                    <div class="post">
                      <img src="post2.jpg" alt="Post 2 Image">
                      <h3><a href="/blog/post2">Post 2 Title</a></h3>
                      <p>Short description of Post 2...</p>
                    </div>
                    <div class="post">
                      <img src="post3.jpg" alt="Post 3 Image">
                      <h3><a href="/blog/post3">Post 3 Title</a></h3>
                      <p>Short description of Post 3...</p>
                    </div>
                  </div>
                </section>
              </main>
              <footer>
                <p>&copy; 2023 My Website. All rights reserved.</p>
              </footer>
            </body>
          </html>
          `,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      {jobs.length > 0 ? (
        jobs.map((job) => {
          return (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
                <div className="d-flex flex-row justify-content-between">
                  <a
                    href="#"
                    className="btn btn-primary"
                    onClick={() => handlePayment(job.id)}
                  >
                    Apply
                  </a>
                  <a
                    href="#"
                    className="btn btn-primary"
                    onClick={() => acceptJob(job.id)}
                  >
                    Confirm
                  </a>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="alert alert-info">No jobs found</div>
      )}
      <div className="">
        <a href="#" className="btn btn-secondary" onClick={rejectJob}>
          Reject Job
        </a>
      </div>
      <div className="">
        <a
          href="#"
          className="btn btn-secondary"
          onClick={checkContractBalance}
        >
          Check contract balance Job
        </a>
      </div>
      <div className="">
        <a href="#" className="btn btn-secondary" onClick={checkClientAddress}>
          Check Client address
        </a>
      </div>
      <div className="">
        <a
          href="#"
          className="btn btn-secondary"
          onClick={checkFreelancerAddress}
        >
          Check Freelancer address
        </a>
      </div>
      <div className="">
        <a href="#" className="btn btn-secondary" onClick={checkEscrowStatus}>
          Check Escrow status
        </a>
      </div>
      <div className="">
        <a href="#" className="btn btn-secondary" onClick={releseFunds}>
          Call arbitrator to release funds
        </a>
      </div>
      {/* <div className="">
                <a href="#" className="btn btn-secondary" onClick={releseEscrow}>Call arbitrator to release funds</a>
            </div> */}
      <div className="">
        <a
          href="#"
          className="btn btn-secondary"
          onClick={getArbitratorAddress}
        >
          Get arbitrator address
        </a>
      </div>
      <div className="">
        <a
          href="#"
          className="btn btn-secondary"
          onClick={verifyCode}
        >
          Verify code
        </a>
      </div>
    </div>
  );
}
