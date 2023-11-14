import React from 'react'

const About = () => {
    return (
        < div class="container marketing" >
            <div class="row featurette">
                <div class="col-md-7 d-flex flex-column justify-content-center p-3">
                    <h2 class="lh-1"> An <span class="text-primary"> Ecommerce App </span> allows users to shop online.</h2>
                    <p class="lead text-wrap">Browse product and view details, add items to a cart, complete purchases, and rate products & add reviews.</p>
                </div>
                <div class="col-md-5">
                    <img className='img-fluid' src='https://www.intelmo.net/images/about/ecommerce-website-developemnt.png' width="500" />
                </div>
            </div>

            <hr class="featurette-divider" />

            <div class="row featurette">
                <div class="col-md-7 order-md-2 d-flex flex-column justify-content-center p-3">
                    <h2 class="featurette-heading fw-normal lh-1">Discreet<span class="text-success"> Payment </span>  Management.</h2>
                    <p class="lead">It also provides payment processing, shipping, and order management capabilities.</p>
                </div>
                <div class="col-md-5 order-md-1">
                    <img className='img-fluid' src='https://www.pngplay.com/wp-content/uploads/6/E-Commerce-Logo-Transparent-File.png' width="500" />
                </div>
            </div>

            <hr class="featurette-divider" />

            <div class="row featurette">
                <div class="col-md-7 d-flex flex-column justify-content-center p-3">
                    <h2 class="featurette-heading fw-normal lh-1">And lastly, <span class="text-success"> Checkout.</span> </h2>
                    <p class="lead">Paypal payment gateway for convenient and easy payment checkout.</p>
                </div>
                <div class="col-md-5">
                    <img className='img-fluid' src='https://neetable.com/img/solutions/ecommerce-app-development/e-commerce-app-development-banner.svg' width="500" />
                </div>
            </div>


        </div >


    )
}

export default About