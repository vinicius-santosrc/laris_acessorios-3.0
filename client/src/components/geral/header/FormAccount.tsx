export const FormAccount: React.FC<any> = ({ component, photoRef }: { component: JSX.Element, photoRef: string }) => {
    return (
        <section className="modal-create-account">
            <div className="modal-create-account__inside">
                <div className="modal-left-side">
                    {photoRef && <img alt="Account Modal" src={photoRef} />}
                </div>
                <div className="modal-right-side">
                    {component}
                </div>
            </div>
        </section>
    )
}
